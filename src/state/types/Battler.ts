import {computed, observable, reaction} from "mobx";
import {Stats} from "./Stats";
import {Character} from "./Character";
import {Skill} from "./Skill";
import {list, object, serializable} from "serializr";
import {cmp, contains, moveItem} from "../../lib/Helpers";
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
  @serializable(list(object(Character))) @observable deceasedEnemies: TEnemy[] = [];

  // No need to serialize since it's automated by quest behavior
  private getAllies: () => TAlly[];
  private getEnemyHome: () => TEnemy[];

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

  newBattle (aliveEnemies: TEnemy [] = []) {
    if (this.inBattle) {
      console.warn("Should not initiate a new battle while already in one");
      this.endBattle();
    }

    // Move monsters from their home to the battle
    // NOTE this is to avoid duplicates when serializing
    aliveEnemies
      .forEach((enemy) => moveItem(enemy, this.getEnemyHome(), this.enemies));

    console.debug("Starting new battle", this.allies, "vs", this.enemies);

    this.turn = 0;
    this.turnActorIndex = 0;
    this.inBattle = true;
  }

  endBattle () {
    if (!this.inBattle) {
      console.warn("Attempting to end a battle when not in one");
      return;
    }

    console.debug("Ending battle");
    const killedAllEnemies = this.enemies.length === 0;

    // Heal/Revive and return enemies to their home
    while (this.enemies.length) {
      const enemy = this.enemies.pop();
      enemy.resetMutableStats();
      console.debug("Healing undefeated enemy", enemy);
      this.getEnemyHome().push(enemy);
    }

    while (this.deceasedEnemies.length) {
      const enemy = this.deceasedEnemies.pop();
      if (!killedAllEnemies) {
        enemy.resetMutableStats();
        console.debug("Reviving defeated enemy", enemy);
      }
      this.getEnemyHome().push(enemy);
    }

    this.inBattle = false;
  }

  performTurnAction (action?: Skill, targets: AllyOrEnemy[] = []) {
    if (action) {
      console.debug(this.turnActor.name, "used", action.info.name, "on", targets.map((t) => t.name).join(", "));
      targets.map((target) =>
        this.emitMemento(target, this.turnActor.useSkill(action, target))
      );
    }

    this.turnActorIndex++;
  }

  passTurnAction (reason = "") {
    const reasonSuffix = reason ? " (" + reason + ")" : undefined;
    console.debug(this.turnActor.name, "passed", reasonSuffix);
    this.turnActorIndex++;
  }

  gotoNextTurn () {
    this.turnActorIndex = 0;
    this.turn++;
  }

  processTurn () {
    console.debug("Finishing turn", this.turn);
    [...this.allies, ...this.enemies].forEach((c) =>
      this.emitMemento(c, c.processTurn())
    );
  }

  emitMemento (target: Character, memento: Stats) {
    const mementoString = memento.nonNeutral
      .map((stat) => stat.info.shortName + " " + stat.toString())
      .join(", ");

    if (mementoString) {
      console.info(target.name, "processed", mementoString);
    }
  }

  initialize (
    getAllies: () => TAlly[],
    getEnemyHome: () => TEnemy[]
  ): Array<() => void> {
    this.getAllies = getAllies;
    this.getEnemyHome = getEnemyHome;

    return [
      // Process turn as soon as it changes
      reaction(
        () => this.turn,
        () => this.processTurn()
      ),

      // Battle victory
      reaction(
        () => this.enemies.length === 0 && this.deceasedEnemies.length > 0,
        (shouldEnd) => shouldEnd && this.endBattle(),
        true
      ),

      // After an action or death we may want to chance turn
      reaction(
        () => this.turnActorIndex >= (this.turnActorOrder.length - 1),
        (isEndOfTurn) => isEndOfTurn && this.gotoNextTurn(),
        true
      ),

      // Move deceased enemies to their own list
      reaction(
        () => this.enemies.filter((m) => m.isDead),
        (dead) => dead.forEach((m) => moveItem(m, this.enemies, this.deceasedEnemies)),
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
