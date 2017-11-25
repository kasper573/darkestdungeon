import {computed, observable, reaction} from "mobx";
import {Stats} from "./Stats";
import {Character} from "./Character";
import {Skill} from "./Skill";
import {list, object, serializable} from "serializr";
import {cmp, contains} from "../../lib/Helpers";
import {randomizeItem} from "../Generators";
import {CharacterStatus} from "./CharacterStatus";

type AllyOrEnemy = Character;

export class Battler<
  TAlly extends AllyOrEnemy = AllyOrEnemy,
  TEnemy extends AllyOrEnemy = AllyOrEnemy
> {
  @serializable @observable inBattle: boolean = false;
  @serializable @observable turn: number = 0;
  @serializable @observable turnActorIndex: number = 0;
  @serializable(list(object(Character))) @observable enemies: TEnemy[] = [];

  // No need to serialize since it's automated by quest behavior
  private getAllies: () => TAlly[];

  @computed get allies () {
    return this.getAllies();
  }

  @computed get turnActorOrder (): AllyOrEnemy[] {
    return [...this.allies, ...this.enemies]
      .sort((a, b) => cmp(a.stats.speed, b.stats.speed));
  }

  @computed get turnActor () {
    return this.turnActorOrder[this.turnActorIndex];
  }

  @computed get canHeroAct () {
    return contains(this.allies, this.turnActor);
  }

  @computed get canEnemyAct () {
    return contains(this.enemies, this.turnActor);
  }

  getActorIndex (actor: AllyOrEnemy) {
    return this.turnActorOrder.indexOf(actor);
  }

  newBattle (enemies: TEnemy [] = []) {
    if (this.inBattle) {
      console.warn("Should not initiate a new battle while already in one");
      this.endBattle();
    }

    this.turn = 0;
    this.turnActorIndex = 0;
    this.inBattle = true;
    this.enemies = enemies.slice();
  }

  endBattle () {
    this.inBattle = false;
    while (this.enemies.length) {
      const enemy = this.enemies.pop();
      if (enemy.isAlive) {
        enemy.resetMutableStats();
      }
    }
  }

  performTurnAction (action?: Skill, targets: AllyOrEnemy[] = []) {
    if (action) {
      console.log(this.turnActor.name, "used", action.info.name, "on", targets.map((t) => t.name).join(", "));
      targets.map((target) =>
        this.emitMemento(target, this.turnActor.useSkill(action, target))
      );
    }

    this.turnActorIndex++;
  }

  passTurnAction (reason = "") {
    const reasonSuffix = reason ? " (" + reason + ")" : undefined;
    console.log(this.turnActor.name, "passed", reasonSuffix);
    this.turnActorIndex++;
  }

  gotoNextTurn () {
    this.turnActorIndex = 0;
    this.turn++;
  }

  processTurn () {
    console.log("Finishing turn", this.turn);
    [...this.allies, ...this.enemies].forEach((c) =>
      this.emitMemento(c, c.processTurn())
    );
  }

  emitMemento (target: Character, memento: Stats) {
    const mementoString = memento.nonNeutral
      .map((stat) => stat.info.shortName + " " + stat.toString())
      .join(", ");

    if (mementoString) {
      console.log(target.name, "processed", mementoString);
    }
  }

  initialize (getAllies: () => TAlly[]): Array<() => void> {
    this.getAllies = getAllies;

    return [
      // Process turn as soon as it changes
      reaction(
        () => this.turn,
        () => this.processTurn()
      ),

      // Battle victory
      reaction(
        () => this.enemies.length > 0 && this.enemies.filter((e) => e.isAlive).length === 0,
        () => this.endBattle(),
        true
      ),

      // After an action or death we may want to chance turn
      reaction(
        () => this.turnActorIndex >= (this.turnActorOrder.length - 1),
        (isEndOfTurn) => isEndOfTurn && this.gotoNextTurn(),
        true
      ),
      
      // Turn automation
      reaction(
        () => [this.turn, this.turnActorIndex, this.inBattle],
        ([turn, idx, inBattle]) => {
          if (!inBattle || !this.turnActor) {
            return;
          }

          if (this.turnActor.dots.get(CharacterStatus.Stun)) {
            this.passTurnAction("stunned");
            return;
          }

          if (!this.canEnemyAct) {
            return;
          }

          // Enemy AI
          const usableSkills = this.turnActor.selectedSkills.filter((s) =>
            s.info.canUse(this.turnActor, this.enemies, this.allies)
          );

          const skill = randomizeItem(usableSkills);
          if (skill) {
            const targets = skill.info.target.select(this.enemies, this.allies);
            this.performTurnAction(skill, targets);
          } else {
            // TODO move towards closest applicable position
            this.passTurnAction("no usable skills");
          }
        },
        true
      )
    ];
  }
}
