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
import {BuildingInfo, createId as createBuildingInfoId} from "../state/types/BuildingInfo";
import {enumMap} from "../lib/Helpers";
import {Quest} from "../state/types/Quest";
import {StatItem} from "../state/types/StatItem";

export const defaultAmbienceOSVolume = 0.25;

export const todo = "?todo?";

export const maxSelectedSkills = 4;
export const equippableItems = new Map<ItemType, number>();
equippableItems.set(ItemType.Weapon, 1);
equippableItems.set(ItemType.Armor, 1);
equippableItems.set(ItemType.Trinket, 2);
export let maxEquippedItems = 0;
for (const count of equippableItems.values()) {
  maxEquippedItems += count;
}

export function addStaticState () {
  let previousLevelInfo: LevelInfo;
  ["Seeker", "Apprentice", "Pretty Cool", "Kickass", "Badass", "Master", "Grand Master"]
    .forEach((name, level) => {
      const info = new LevelInfo();
      info.id = level;
      info.number = level;
      info.name = name;
      info.experience = Math.pow(level, 2) * 1000;
      StaticState.instance.add((i) => i.levels, info);

      if (previousLevelInfo) {
        previousLevelInfo.next = info;
      }
      info.previous = previousLevelInfo;
      previousLevelInfo = info;
    });

  ["Hopeless", "Paranoid", "Gullible", "Ignorant"].forEach((name, index) => {
    const info = new AfflictionInfo();
    info.id = name;
    info.name = name;

    const stats = new Stats();
    stats.speed.value = -index;
    info.stats = stats;

    StaticState.instance.add((i) => i.afflictions, info);
  });

  const crush = new SkillInfo();
  crush.id = crush.name = "Crush";
  StaticState.instance.add((i) => i.skills, crush);
  crush.stats = new Stats();
  crush.stats.accuracy.value = 85;
  crush.stats.criticalChance.value = 0.05;
  crush.stats.statuses.get(CharacterStatus.Bleed).value = 0.5;
  crush.stats.statusDamageScales.get(CharacterStatus.Bleed).value = 0.5;
  crush.position = [false, false, true, true];
  crush.target = SkillTarget.oneOf([false, true, true, true]);

  const rampart = new SkillInfo();
  rampart.id = rampart.name = "Rampart";
  StaticState.instance.add((i) => i.skills, rampart);
  rampart.movement = 1;
  rampart.stats = new Stats();
  rampart.stats.accuracy.value = 90;
  rampart.stats.criticalChance.value = 0.05;
  rampart.stats.statuses.get(CharacterStatus.Move).value = 1;
  rampart.stats.statuses.get(CharacterStatus.Stun).value = 1;
  rampart.position = [false, true, true, true];
  rampart.target = SkillTarget.oneOf([false, true, true, true]);

  const bellow = new SkillInfo();
  bellow.id = bellow.name = "Bellow";
  StaticState.instance.add((i) => i.skills, bellow);
  bellow.movement = 1;
  bellow.stats = new Stats();
  bellow.stats.accuracy.value = 90;
  bellow.stats.stress.value = 10;
  bellow.stats.criticalChance.value = 0.05;
  bellow.stats.statuses.get(CharacterStatus.Move).value = 1;
  bellow.stats.statuses.get(CharacterStatus.Stun).value = 1;
  bellow.position = [false, true, true, true];
  bellow.target = SkillTarget.anyOne(SkillTargetObject.Enemy);
  bellow.stats.statuses.get(CharacterStatus.Buff).value = 0.8;
  bellow.buff = new TurnStats();
  bellow.buff.dodge.value = -5;
  bellow.buff.speed.value = -5;

  const defender = new SkillInfo();
  defender.id = defender.name = "Defender";
  StaticState.instance.add((i) => i.skills, defender);
  defender.stats = new Stats();
  defender.stats.stress.value = -5;
  defender.position = [false, true, true, true];
  defender.target = SkillTarget.anyOne(SkillTargetObject.Ally);
  defender.buff = new TurnStats();
  defender.buff.protect.value = 5;

  const heal = new SkillInfo();
  heal.id = heal.name = "Heal";
  StaticState.instance.add((i) => i.skills, heal);
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
    info.monsters = StaticState.instance.monsters;
    StaticState.instance.add((i) => i.dungeons, info);
  });

  let heirloomIndex = 0;
  enumMap<HeirloomType>(HeirloomType)
    .forEach((heirloomType, name) => {
      addItem("heirloom" + heirloomType, {
        name,
        pluralName: name + "s",
        type: ItemType.Heirloom,
        heirloomType,
        value: 1 + heirloomIndex++,
        description: "Use for building upgrades"
      });
    });

  ["Excalibur", "Teddy bear", "Unicorn", "Magic Wand", "Torn Wing", "Banana", "Happy Thoughts",
    "Balloon", "Longsword", "Dagger", "Shield", "Helmet", "Furnace", "Cape", "Feather", "Pen", "Bow & Arrow"
  ].forEach((name, index) => {
    let damage = 0;
    let accuracy = 0;
    let protect = 0;
    let maxHealth = 0;
    let type;

    switch (index % 3) {
      case 0:
        type = ItemType.Weapon;
        damage = (index + 1) * 2;
        accuracy = (index + 1);
        break;
      case 1:
        type = ItemType.Armor;
        maxHealth = (index + 1) * 2;
        protect = (index + 1) * 2;
        break;
      case 2:
        type = ItemType.Trinket;
        maxHealth = (1 + index);
        protect = (2 + index * 2);
        damage = (3 + index * 3);
        break;
    }

    addItem(name, {
      value: 25 + 50 * index,
      type,
      stats: {
        maxHealth,
        protect,
        damage,
        accuracy
      }
    });
  });

  addItems({
    "Food": {
      description: "Eat to restore health and starve off hunger.",
      value: 75,
      getStoreCount: (quest: Quest) => 18,
      resetHunger: true,
      stats: {
        health: 5
      }
    },
    "Shovel": {
      description: "Use to clear obstacles and break into things.",
      value: 250,
      getStoreCount: (quest: Quest) => 4
    },
    "Antivenom": {
      description: "Use to counter blights, poisons and toxins.",
      value: 150,
      getStoreCount: (quest: Quest) => 6,
      stats: {
        statusChances: {
          [CharacterStatus.Blight]: -1
        }
      }
    },
    "Bandages": {
      description: "Use to stanch the flow of bleeding.",
      value: 150,
      getStoreCount: (quest: Quest) => 6,
      stats: {
        statusChances: {
          [CharacterStatus.Bleed]: -1
        }
      }
    },
    "Herbs": {
      description: "Use to cleanse items and prevent maladies. " +
      "Can also be applied to a hero to eliminate combat debuffs.",
      value: 200,
      getStoreCount: (quest: Quest) => 6,
      removeBuffs: true
    },
    "Torch": {
      description: "Increases the light level.",
      value: 75,
      getStoreCount: (quest: Quest) => 18,
      offsetLight: 1
    },
    "Skeleton Key": {
      description: "Used to unlock strongboxes and doors.",
      value: 200,
      getStoreCount: (quest: Quest) => 6,
      offsetLight: 1
    },
    "Holy Water": {
      description: "Use to purge evil and restore purity. Can also be applied to a hero to increase resistances",
      value: 150,
      getStoreCount: (quest: Quest) => 6,
      buff: {
        resistances: {
          [CharacterStatus.Bleed]: 0.1,
          [CharacterStatus.Blight]: 0.1,
          [CharacterStatus.Buff]: 0.1,
          [CharacterStatus.Disease]: 0.1,
          [CharacterStatus.Move]: 0.1,
          [CharacterStatus.Stun]: 0.1,
          [CharacterStatus.Trap]: 0.1
        }
      }
    }
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
        stat.info.isPercentage ? 0.1 : (1 + index)
      );

    info.stats = stats;

    StaticState.instance.add((i) => i.quirks, info);
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

    info.bannedTreatmentIds.push("tavern.bar");

    info.stats = stats;

    StaticState.instance.add((i) => i.diseases, info);
  });

  addBuildings({
    abbey: {
      name: "Abbey",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/abbey-bg.jpg")
    },
    blacksmith: {
      name: "Blacksmith",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/blacksmith-bg.jpg"),
      children: {
        mastery: {
          name: "Smithing",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Allows upgrading equipment to higher levels",
          items: [
            {cost: null, effects: {cost: 1000, level: 1}},
            {cost: {[HeirloomType.Deed]: 1, [HeirloomType.Crest]: 2}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 2, [HeirloomType.Crest]: 3}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 5}, effects: {level: 1}}
          ]
        },
        training: {
          name: "Furnace",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Reduces cost of upgrading equipment",
          items: [
            {cost: {[HeirloomType.Deed]: 1, [HeirloomType.Crest]: 2}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 2, [HeirloomType.Crest]: 3}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 5}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 5, [HeirloomType.Crest]: 6}, effects: {cost: -100}}
          ]
        }
      }
    },
    graveyard: {
      name: "Graveyard",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/graveyard-bg.jpg")
    },
    guild: {
      name: "Guild",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/guild-bg.jpg"),
      children: {
        mastery: {
          name: "Treatment Ward",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Allows upgrading hero combat skills to higher ranks",
          items: [
            {cost: null, effects: {cost: 1000, level: 1}},
            {cost: {[HeirloomType.Deed]: 1, [HeirloomType.Crest]: 2}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 2, [HeirloomType.Crest]: 3}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {level: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 5}, effects: {level: 1}}
          ]
        },
        training: {
          name: "Training Regiment",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Reduces cost of upgrading hero skills",
          items: [
            {cost: {[HeirloomType.Deed]: 1, [HeirloomType.Crest]: 2}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 2, [HeirloomType.Crest]: 3}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 5}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 5, [HeirloomType.Crest]: 6}, effects: {cost: -100}}
          ]
        }
      }
    },
    memoirs: {
      name: "Memoirs",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/memoirs-bg.jpg")
    },
    sanitarium: {
      name: "Sanitarium",
      avatarUrl: require("../../assets/images/avatar.jpg"),
      backgroundUrl: require("../../assets/images/sanitarium-bg.jpg"),
      children: {
        quirks: {
          name: "Treatment Ward",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Treat Quirks and other problematic behaviors.",
          items: [
            {cost: null, effects: {size: 1, cost: 500, treatQuirk: 1}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 7}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 1}}
          ]
        },
        diseases: {
          name: "Medical Ward",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Treat Diseases, humours, and other physical maladies.",
          items: [
            {cost: null, effects: {size: 1, cost: 500, treatDisease: 1}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 7}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 1}}
          ]
        }
      }
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
            {cost: null, effects: {size: 2}},
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
            {cost: null, effects: {size: 6}},
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
            {cost: null, effects: {size: 1, cost: 500}},
            {cost: {[HeirloomType.Deed]: 2, [HeirloomType.Crest]: 3}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 7}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 1}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        },
        gambling: {
          name: "Gambling",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Improves the gambling facilities",
          items: [
            {cost: null, effects: {size: 1, cost: 2500}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        },
        recruits: {
          name: "Brothel",
          avatarUrl: require("../../assets/images/avatar.jpg"),
          description: "Improves the brothel facilities",
          items: [
            {cost: null, effects: {size: 1, cost: 500}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {cost: -100}},
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
  info.skills = StaticState.instance.skills;

  for (const stat of info.stats.statuses.values()) {
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
  StaticState.instance.add((i) => i.heroes, template);
  StaticState.instance.add((i) => i.classes, classInfo);
  return template;
}

function addMonster (className: string, characterNames?: string [], rarity?: number, unique?: boolean) {
  const classInfo = createStandardMonsterClass(className);
  const template = new CharacterTemplate(classInfo, characterNames, rarity, unique);
  StaticState.instance.add((i) => i.monsters, template);
  StaticState.instance.add((i) => i.classes, classInfo);
  return template;
}

function addBuildings (rawInfo: any, parent = StaticState.instance.buildingInfoRoot) {
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
      item.id = createBuildingInfoId([info.id, index.toString()]);
      if (cost) {
        for (const heirloomName in cost) {
          item.cost.set(parseInt(heirloomName, 10) as HeirloomType, cost[heirloomName]);
        }
      }
      Object.assign(item.effects, effects);

      // Store item in static state list
      StaticState.instance.add((i) => i.buildingUpgrades, item);
      return item;
    });

    // Parse raw children
    if (children) {
      addBuildings(children, info);
    }
  }
}

function addItems (rawInfo: any, defaultType = ItemType.Consumable) {
  for (const itemId in rawInfo) {
    const info = addItem(itemId, rawInfo[itemId]);
    if (info.type !== undefined) {
      info.type = defaultType;
    }
  }
}

function addItem (itemId: string, rawInfo: any) {
  const info = new ItemInfo();
  info.id = itemId;
  info.name = itemId;
  info.pluralName = itemId;

  const {stats, buff, ...props} = rawInfo;
  Object.assign(info, props);
  addStats(stats, info.stats);
  info.buff = parseBuff(buff);

  StaticState.instance.add((i) => i.items, info);
  return info;
}

function addStats (rawStats: any, stats: Stats) {
  for (const statKey in rawStats) {
    const rawStat = rawStats[statKey];
    const realStat = (stats as any)[statKey];
    if (realStat instanceof StatItem) {
      realStat.value = rawStat;
    } else if (realStat instanceof Map) {
      realStat.forEach((stat: StatItem, key) => {
        stat.value = rawStat[key];
      });
    }
  }
}

function parseBuff (rawBuff: any) {
  if (!rawBuff) {
    return;
  }

  const buffStats = new TurnStats();
  rawBuff.turns = rawBuff.turns as number;
  addStats(rawBuff, buffStats);
  return buffStats;
}
