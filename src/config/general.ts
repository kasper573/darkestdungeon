import {StaticState} from "../state/StaticState";
import {DungeonInfo} from "../state/types/DungeonInfo";
import {LevelInfo} from "../state/types/LevelInfo";
import {AfflictionInfo} from "../state/types/AfflictionInfo";
import {CharacterClassInfo} from "../state/types/CharacterClassInfo";
import {HeirloomType, ItemInfo, ItemType} from "../state/types/ItemInfo";
import {QuirkInfo} from "../state/types/QuirkInfo";
import {CharacterStatus} from "../state/types/CharacterStatus";
import {SkillInfo, SkillTarget, SkillTargetObject} from "../state/types/SkillInfo";
import {DiseaseInfo} from "../state/types/DiseaseInfo";
import {Stats, TurnStats} from "../state/types/Stats";
import {CharacterTemplate} from "../state/types/CharacterTemplate";
import {BuildingUpgradeInfo} from "../state/types/BuildingUpgradeInfo";
import {BuildingInfo} from "../state/types/BuildingInfo";
import {enumMap} from "../lib/ArrayHelpers";

export const defaultAmbienceOSVolume = 0.25;

export const todo = "?todo?";

export function addStaticState () {
  ["Seeker", "Apprentice", "Pretty Cool", "Kickass", "Badass", "Master", "Grand Master"]
    .forEach((name, level) => {
      const info = new LevelInfo();
      info.id = level;
      info.number = level;
      info.name = name;
      info.experience = Math.pow(level, 2) * 1000;
      StaticState.instance.levels.set(info.id, info);
    });

  for (let level = 0; level < StaticState.instance.levels.size; level++) {
    const info = StaticState.instance.levels.get(level);
    info.previous = StaticState.instance.levels.get(this.id - 1);
    info.next = StaticState.instance.levels.get(this.id + 1);
  }

  ["Hopeless", "Paranoid", "Gullible", "Ignorant"].forEach((name, index) => {
    const info = new AfflictionInfo();
    info.id = name;
    info.name = name;

    const stats = new Stats();
    stats.speed.value = -index;
    info.stats = stats;

    StaticState.instance.afflictions.set(info.id, info);
  });

  const crush = new SkillInfo();
  crush.id = crush.name = "Crush";
  StaticState.instance.skills.set(crush.id, crush);
  crush.stats = new Stats();
  crush.stats.accuracy.value = 85;
  crush.stats.criticalChance.value = 0.05;
  crush.stats.statusChances.get(CharacterStatus.Bleed).value = 0.5;
  crush.stats.statusDamageScales.get(CharacterStatus.Bleed).value = 0.5;
  crush.position = [false, false, true, true];
  crush.target = SkillTarget.oneOf([false, true, true, true]);

  const rampart = new SkillInfo();
  rampart.id = rampart.name = "Rampart";
  StaticState.instance.skills.set(rampart.id, rampart);
  rampart.movement = 1;
  rampart.stats = new Stats();
  rampart.stats.accuracy.value = 90;
  rampart.stats.criticalChance.value = 0.05;
  rampart.stats.statusChances.get(CharacterStatus.Move).value = 1;
  rampart.stats.statusChances.get(CharacterStatus.Stun).value = 1;
  rampart.position = [false, true, true, true];
  rampart.target = SkillTarget.oneOf([false, true, true, true]);

  const bellow = new SkillInfo();
  bellow.id = bellow.name = "Bellow";
  StaticState.instance.skills.set(bellow.id, bellow);
  bellow.movement = 1;
  bellow.stats = new Stats();
  bellow.stats.accuracy.value = 90;
  bellow.stats.stress.value = 10;
  bellow.stats.criticalChance.value = 0.05;
  bellow.stats.statusChances.get(CharacterStatus.Move).value = 1;
  bellow.stats.statusChances.get(CharacterStatus.Stun).value = 1;
  bellow.position = [false, true, true, true];
  bellow.target = SkillTarget.anyOne(SkillTargetObject.Enemy);
  bellow.stats.statusChances.get(CharacterStatus.Buff).value = 0.8;
  bellow.buff = new TurnStats();
  bellow.buff.dodge.value = -5;
  bellow.buff.speed.value = -5;

  const defender = new SkillInfo();
  defender.id = defender.name = "Defender";
  StaticState.instance.skills.set(defender.id, defender);
  defender.stats = new Stats();
  defender.stats.stress.value = -5;
  defender.position = [false, true, true, true];
  defender.target = SkillTarget.anyOne(SkillTargetObject.Ally);
  defender.buff = new TurnStats();
  defender.buff.protect.value = 5;

  const heal = new SkillInfo();
  heal.id = heal.name = "Heal";
  StaticState.instance.skills.set(heal.id, heal);
  heal.stats = new Stats();
  heal.stats.health.value = 5;
  heal.position = [true, true, false, false];
  heal.target = SkillTarget.anyOne(SkillTargetObject.Ally);
  heal.damageScale = 0;

  const commonHeroNames = [
    "CoffeeDetective", "Gr4nnysith", "Koob0", "Kvilex", "PuzzleDev", "Kfirba2"
  ];

  addHero("Ninja", commonHeroNames);
  addHero("Superhero", commonHeroNames);
  addHero("Magician", commonHeroNames);
  addHero("Baller", commonHeroNames);
  addHero("Chad", commonHeroNames);

  addHero("Master of Everything", ["Noob"], 0.1, true);

  addMonster("Skeleton");
  addMonster("Demon");
  addMonster("Devil");
  addMonster("Snake");

  addMonster("Destruction of Everything", ["jQuery"], 0.1, true);

  ["Ruins", "Warrens", "Weald", "Cove", "Dankest Dungeon"].forEach((name) => {
    const info = new DungeonInfo();
    info.id = name;
    info.name = name;
    info.monsters = Array.from(StaticState.instance.monsters.values());
    StaticState.instance.dungeons.set(info.id, info);
  });

  enumMap<HeirloomType>(HeirloomType)
    .forEach((value, name) => {
      const info = new ItemInfo();
      info.id = "heirloom" + value;
      info.name = name;
      info.type = ItemType.Heirloom;
      info.heirloomType = value;

      StaticState.instance.items.set(info.id, info);
    });

  ["Excalibur", "Large beer", "Teddy bear", "Unicorn", "Potato"].forEach((name, index) => {
    const info = new ItemInfo();
    info.id = name;
    info.name = name;
    info.goldCost = 25 + 50 * index;

    if (index % 2 === 0) {
      info.type = ItemType.Weapon;
      info.stats.damage.value = (10 + Math.pow(index, 2));
      info.stats.accuracy.value = (2 + index * 2);
    } else {
      info.type = ItemType.Armor;
      info.stats.maxHealth.value = (20 + index * 5);
      info.stats.protect.value = (2 + index * 2);
    }

    StaticState.instance.items.set(info.id, info);
  });

  ["Hard Noggin", "Balanced", "Nymphomania", "Quick Reflexes", "Quickdraw",
    "Known Cheat", "Night Blindness", "Thanatophobia", "Witness"].forEach((name, index) => {
    const info = new QuirkInfo();
    info.id = name;
    info.name = name;

    const isPositive = index % 2 === 0;
    const stats = new Stats();
    const stat = stats.base[index % stats.base.length];
    stat.value =
      (isPositive ? 1 : -1) * (
        stat.info.isPercentage ? 0.1 : (1 + index * 2)
      );

    info.stats = stats;

    StaticState.instance.quirks.set(info.id, info);
  });

  ["Terror", "Flynn", "Ok Ok"].forEach((name, index) => {
    const info = new DiseaseInfo();
    info.id = name;
    info.name = name;
    const stats = new Stats();
    const stat = stats.base[index % stats.base.length];
    stat.value = -1 * (
      stat.info.isPercentage ? 0.1 : (1 + index * 2)
    );

    info.stats = stats;

    StaticState.instance.diseases.set(info.id, info);
  });

  addBuildingInfo({
    abbey: {
      name: "Abbey",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/abbey-bg.jpg")
    },
    blacksmith: {
      name: "Blacksmith",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/blacksmith-bg.jpg")
    },
    graveyard: {
      name: "Graveyard",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/graveyard-bg.jpg")
    },
    guild: {
      name: "Guild",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/guild-bg.jpg")
    },
    memoirs: {
      name: "Memoirs",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/memoirs-bg.jpg")
    },
    sanitarium: {
      name: "Sanitarium",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/sanitarium-bg.jpg")
    },
    coach: {
      name: "Stage Coach",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/coach-bg.jpg"),
      description: "Upgrading the Stage Coach increases the available" +
      " heroes for hire each week or increases your roster size.",
      children: {
        network: {
          name: "Stagecoach Network",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Increases the number of recruits available for hire",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 2}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {size: 2}}
          ]
        },
        roster: {
          name: "Hero Barracks",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Increases the size of the hero roster",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 2}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {size: 2}}
          ]
        },
        recruits: {
          name: "Experienced Recruits",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Provides a chance of higher level recruits",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {level: 1}}
          ]
        }
      }
    },
    tavern: {
      name: "Tavern",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/tavern-bg.jpg"),
      description: "Upgrading the Tavern increases the number of available stress treatments and their effectiveness",
      children: {
        bar: {
          name: "Bar",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Improves the bar facilities",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {discount: 0.2}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        },
        gambling: {
          name: "Gambling",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Improves the gambling facilities",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {discount: 0.2}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        },
        recruits: {
          name: "Brothel",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Improves the brothel facilities",
          items: [
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {discount: 0.2}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        }
      }
    },
    provision: {
      name: "Provision",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/provision-bg.jpg")
    }
  });
}

function createStandardCharacterClass (className: string) {
  const info = new CharacterClassInfo();
  info.id = info.name = className;
  info.stats = new Stats();
  info.stats.maxHealth.value = 50;
  info.stats.maxStress.value = 200;
  info.stats.protect.value = 10;
  info.stats.damage.value = 10;
  info.stats.dodge.value = 10;
  info.stats.accuracy.value = 10;
  info.stats.speed.value = 10;
  info.stats.criticalChance.value = 0.05;
  info.skills = Array.from(StaticState.instance.skills.values());

  for (const stat of info.stats.statusChances.values()) {
    stat.value = 0.5;
  }

  for (const stat of info.stats.resistances.values()) {
    stat.value = 0.2;
  }
  return info;
}

function createStandardHeroClass (className: string) {
  return createStandardCharacterClass(className);
}

function createStandardMonsterClass (className: string) {
  return createStandardCharacterClass(className);
}

function addHero (className: string, characterNames?: string [], rarity?: number, unique?: boolean) {
  const classInfo = createStandardHeroClass(className);
  const template = new CharacterTemplate(classInfo, characterNames, rarity, unique);
  StaticState.instance.heroes.set(template.id, template);
  StaticState.instance.classes.set(template.id, classInfo);
  return template;
}

function addMonster (className: string, characterNames?: string [], rarity?: number, unique?: boolean) {
  const classInfo = createStandardMonsterClass(className);
  const template = new CharacterTemplate(classInfo, characterNames, rarity, unique);
  StaticState.instance.monsters.set(template.id, template);
  StaticState.instance.classes.set(template.id, classInfo);
  return template;
}

function addBuildingInfo (rawInfo: any, parent = StaticState.instance.buildingInfoRoot) {
  for (const key in rawInfo) {
    // Add to parent
    const info = new BuildingInfo();
    info.key = key;
    info.parent = parent;
    parent.children.set(key, info);

    // Assign props
    const {children, items, ...props} = rawInfo[key];
    Object.assign(info, props);

    // Parse raw items
    info.items = (items || []).map((rawItem: any, index: number) => {
      const {effects, cost} = rawItem;
      const item = new BuildingUpgradeInfo();
      item.id = BuildingUpgradeInfo.createId([info.id, index.toString()]);
      for (const heirloomName in cost) {
        item.cost.set(parseInt(heirloomName, 10) as HeirloomType, cost[heirloomName]);
      }
      Object.assign(item.effects, effects);

      // Store item in static state list
      StaticState.instance.buildingUpgrades.set(item.id, item);
      return item;
    });

    // Parse raw children
    if (children) {
      addBuildingInfo(children, info);
    }
  }
}
