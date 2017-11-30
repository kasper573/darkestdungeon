import {StaticState} from "../state/StaticState";
import {DungeonInfo} from "../state/types/DungeonInfo";
import {LevelInfo} from "../state/types/LevelInfo";
import {AfflictionInfo} from "../state/types/AfflictionInfo";
import {CharacterClassInfo} from "../state/types/CharacterClassInfo";
import {HeirloomType, ItemInfo, ItemType} from "../state/types/ItemInfo";
import {QuirkInfo} from "../state/types/QuirkInfo";
import {CharacterStatus} from "../state/types/CharacterStatus";
import {SkillInfo, SkillTarget, SkillTargetObject} from "../state/types/SkillInfo";
import {Stats, TurnStats} from "../state/types/Stats";
import {CharacterTemplate} from "../state/types/CharacterTemplate";
import {BuildingUpgradeInfo} from "../state/types/BuildingUpgradeInfo";
import {BuildingInfo, createId as createBuildingInfoId} from "../state/types/BuildingInfo";
import {StatItem} from "../state/types/StatItem";

export const defaultAmbienceOSVolume = 0.25;

export const todo = "?todo?";

export const recommendedFoodCount = 8;

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
  crush.iconUrl = require("../../assets/dd/images/raid/camping/skill_icons/camp_skill_abandon_hope.png");
  StaticState.instance.add((i) => i.skills, crush);
  crush.stats = new Stats();
  crush.stats.accuracy.value = 85;
  crush.stats.criticalChance.value = 0.05;
  crush.stats.statuses.get(CharacterStatus.Bleed).value = 0.5;
  crush.stats.statusDamageScales.get(CharacterStatus.Bleed).value = 0.5;
  crush.position = [false, false, true, true];
  crush.target = SkillTarget.oneOf([false, true, false, true]);

  const rampart = new SkillInfo();
  rampart.id = rampart.name = "Rampart";
  rampart.iconUrl = require("../../assets/dd/images/raid/camping/skill_icons/camp_skill_anger_management.png");
  StaticState.instance.add((i) => i.skills, rampart);
  rampart.movement = 1;
  rampart.stats = new Stats();
  rampart.stats.accuracy.value = 90;
  rampart.stats.criticalChance.value = 0.05;
  rampart.stats.statuses.get(CharacterStatus.Move).value = 1;
  rampart.stats.statuses.get(CharacterStatus.Stun).value = 1;
  rampart.position = [false, true, true, true];
  rampart.target = SkillTarget.oneOf([true, false, true, false]);

  const bellow = new SkillInfo();
  bellow.id = bellow.name = "Bellow";
  bellow.iconUrl = require("../../assets/dd/images/raid/camping/skill_icons/camp_skill_clean_guns.png");
  StaticState.instance.add((i) => i.skills, bellow);
  bellow.movement = 1;
  bellow.stats = new Stats();
  bellow.stats.accuracy.value = 90;
  bellow.stats.stress.value = 10;
  bellow.stats.criticalChance.value = 0.05;
  bellow.statusTurns = 1;
  bellow.stats.statuses.get(CharacterStatus.Move).value = 1;
  bellow.stats.statuses.get(CharacterStatus.Stun).value = 1;
  bellow.position = [false, true, true, false];
  bellow.target = SkillTarget.anyOne(SkillTargetObject.Enemy);
  bellow.stats.statuses.get(CharacterStatus.Buff).value = 0.8;
  bellow.buff = new TurnStats();
  bellow.buff.dodge.value = -5;
  bellow.buff.speed.value = -5;

  const defender = new SkillInfo();
  defender.id = defender.name = "Defender";
  defender.iconUrl = require("../../assets/dd/images/raid/camping/skill_icons/camp_skill_bear_traps.png");
  StaticState.instance.add((i) => i.skills, defender);
  defender.stats = new Stats();
  defender.stats.stress.value = -5;
  defender.position = [false, true, true, true];
  defender.target = SkillTarget.anyOne(SkillTargetObject.Ally);
  defender.buff = new TurnStats();
  defender.buff.protect.value = 5;

  const heal = new SkillInfo();
  heal.iconUrl = require("../../assets/dd/images/raid/camping/skill_icons/camp_skill_bandage.png");
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

  const ninja = addHero("Ninja", commonHeroNames);
  ninja.classInfo.avatarUrl = require("../../assets/dd/images/heroes/jester/jester_A/jester_portrait_roster.png");
  const superHero = addHero("Superhero", commonHeroNames);
  superHero.classInfo.avatarUrl = require("../../assets/dd/images/heroes/leper/leper_A/leper_portrait_roster.png");
  const magician = addHero("Magician", commonHeroNames);
  magician.classInfo.avatarUrl = require("../../assets/dd/images/heroes/vestal/vestal_A/vestal_portrait_roster.png");
  const baller = addHero("Baller", commonHeroNames);
  baller.classInfo.avatarUrl = require("../../assets/dd/images/heroes/hellion/hellion_A/hellion_portrait_roster.png");
  const chad = addHero("Chad", commonHeroNames);
  chad.classInfo.avatarUrl = require(
    "../../assets/dd/images/heroes/bounty_hunter/bounty_hunter_A/bounty_hunter_portrait_roster.png"
  );

  const noob = addHero("Master of Everything", ["Noob"], 0.1, true);
  noob.classInfo.avatarUrl = require("../../assets/dd/images/heroes/crusader/crusader_A/crusader_portrait_roster.png");

  addMonster("Skeleton");
  addMonster("Demon");
  addMonster("Devil");
  addMonster("Snake");

  const jQuery = addMonster("Destruction of Everything", ["jQuery"], 0.1, true);
  jQuery.classInfo.avatarUrl = require("../../assets/images/unicorn.jpg");

  ["Ruins", "Warrens", "Weald", "Cove", "Dankest Dungeon"].forEach((name) => {
    const info = new DungeonInfo();
    info.id = name;
    info.name = name;
    info.monsters = StaticState.instance.monsters;
    StaticState.instance.add((i) => i.dungeons, info);
  });
  
  addItems({
    // Heirlooms
    "Bust": {
      name: "Bust",
      pluralName: "Busts",
      iconUrl: require("../../assets/dd/images/shared/estate/currency.bust.icon.png"),
      itemUrl: require("../../assets/dd/images/panels/icons_equip/heirloom/inv_heirloom+bust.png"),
      type: ItemType.Heirloom,
      heirloomType: HeirloomType.Bust,
      value: 1,
      description: "Use for building upgrades"
    },
    "Portrait": {
      name: "Portrait",
      pluralName: "Portraits",
      iconUrl: require("../../assets/dd/images/shared/estate/currency.portrait.icon.png"),
      itemUrl: require("../../assets/dd/images/panels/icons_equip/heirloom/inv_heirloom+portrait.png"),
      type: ItemType.Heirloom,
      heirloomType: HeirloomType.Portrait,
      value: 2,
      description: "Use for building upgrades"
    },
    "Deed": {
      name: "Deed",
      pluralName: "Deeds",
      iconUrl: require("../../assets/dd/images/shared/estate/currency.deed.icon.png"),
      itemUrl: require("../../assets/dd/images/panels/icons_equip/heirloom/inv_heirloom+deed.png"),
      type: ItemType.Heirloom,
      heirloomType: HeirloomType.Deed,
      value: 3,
      description: "Use for building upgrades"
    },
    "Crest": {
      name: "Crest",
      pluralName: "Crests",
      iconUrl: require("../../assets/dd/images/shared/estate/currency.crest.icon.png"),
      itemUrl: require("../../assets/dd/images/panels/icons_equip/heirloom/inv_heirloom+crest.png"),
      type: ItemType.Heirloom,
      heirloomType: HeirloomType.Crest,
      value: 4,
      description: "Use for building upgrades"
    },

    // Store items
    "Food": {
      description: "Eat to restore health and starve off hunger.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/provision/inv_provision+_2.png"),
      value: 75,
      sellValueScale: 0.25,
      getStoreCount: () => 18,
      resetHunger: true,
      stats: {
        health: 5
      }
    },
    "Shovel": {
      description: "Use to clear obstacles and break into things.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+shovel.png"),
      value: 250,
      sellValueScale: 0.25,
      getStoreCount: () => 4
    },
    "Antivenom": {
      description: "Use to counter blights, poisons and toxins.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+antivenom.png"),
      value: 150,
      sellValueScale: 0.25,
      getStoreCount: () => 6,
      stats: {
        statusChances: {
          [CharacterStatus.Blight]: -1
        }
      }
    },
    "Bandages": {
      description: "Use to stanch the flow of bleeding.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+bandage.png"),
      value: 150,
      sellValueScale: 0.25,
      getStoreCount: () => 6,
      stats: {
        statusChances: {
          [CharacterStatus.Bleed]: -1
        }
      }
    },
    "Herbs": {
      description: "Use to cleanse items and prevent maladies. " +
      "Can also be applied to a hero to eliminate combat debuffs.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+medicinal_herbs.png"),
      value: 200,
      sellValueScale: 0.25,
      getStoreCount: () => 6,
      removeBuffs: true
    },
    "Torch": {
      description: "Increases the light level.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+torch.png"),
      value: 75,
      sellValueScale: 0.25,
      getStoreCount: () => 18,
      offsetLight: 1
    },
    "Skeleton Key": {
      description: "Used to unlock strongboxes and doors.",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+skeleton_key.png"),
      value: 200,
      sellValueScale: 0.25,
      getStoreCount: () => 6,
      offsetLight: 1
    },
    "Holy Water": {
      description: "Use to purge evil and restore purity. Can also be applied to a hero to increase resistances",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/supply/inv_supply+holy_water.png"),
      value: 150,
      sellValueScale: 0.25,
      getStoreCount: () => 6,
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
    },

    // Equipment

    "Brutal Hairpin": {
      description: "A ridiculously large hairpin once belonging to a giant",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+brutal_hairpin.png"),
      value: 200,
      type: ItemType.Weapon,
      stats: {
        accuracy: 5,
        damage: 15
      }
    },

    "Spiked Club": {
      description: "A wooden club infused with metal spikes",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+cudgel_weight.png"),
      value: 200,
      type: ItemType.Weapon,
      stats: {
        accuracy: 10,
        damage: 10
      }
    },

    "Metal Shield": {
      description: "A decorated shield made out of metal",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+rampart_shield.png"),
      value: 200,
      type: ItemType.Armor,
      stats: {
        maxHealth: 10,
        protect: 10
      }
    },

    "Cloak of Swiftness": {
      description: "A cloak of mystical power that makes the wearer move with speed",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+swift_cloak.png"),
      value: 200,
      type: ItemType.Armor,
      stats: {
        speed: 10,
        dodge: 10
      }
    },

    "Book of Rage": {
      description: "Feel the power of the dark side",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+book_of_rage.png"),
      value: 400,
      type: ItemType.Trinket,
      stats: {
        dodge: -5,
        damage: 5
      }
    },

    "Cursed Buckle": {
      description: "Protects its wearer at the cost of speed",
      itemUrl: require("../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+cursed_buckle.png"),
      value: 400,
      type: ItemType.Trinket,
      stats: {
        speed: -5,
        protect: 5
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

    if (index % 4 === 0) {
      info.isDisease = true;
      info.bannedTreatmentIds.push("tavern.bar");
    }

    StaticState.instance.add((i) => i.quirks, info);
  });

  addBuildings({
    abbey: {
      name: "Abbey",
      iconUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.icon_roster.png"),
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.icon.png"),
      slotImageUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.locked_hero_slot_overlay.png"),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/abbey/abbey.character_background.png"
      ),
      children: {
        bar: {
          name: "Cloister",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.meditation.icon.png"),
          description: "Peace through meditation",
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
          name: "Trancept",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.prayer.icon.png"),
          description: "Pray to a Higher Power",
          items: [
            {cost: null, effects: {size: 1, cost: 2500}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        },
        recruits: {
          name: "Penance Hall",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/abbey/abbey.flagellation.icon.png"),
          description: "Flagellation brings absolution",
          items: [
            {cost: null, effects: {size: 1, cost: 500}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {recovery: 0.2}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 12, [HeirloomType.Crest]: 16}, effects: {recovery: 0.2}}
          ]
        }
      }
    },
    blacksmith: {
      name: "Blacksmith",
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/blacksmith/blacksmith.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/buildings/blacksmith/blacksmith.character.png"),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/blacksmith/blacksmith.character_background.png")
      ,
      children: {
        mastery: {
          name: "Smithing",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/blacksmith/blacksmith.weapon.icon.png"),
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
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/blacksmith/blacksmith.cost.icon.png"),
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
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/graveyard/graveyard.icon.png"),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/graveyard/graveyard.character_background.png"
      )
    },
    guild: {
      name: "Guild",
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/guild/guild.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/buildings/guild/guild.character.png"),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/guild/guild.character_background.png"
      ),
      children: {
        mastery: {
          name: "Instructor Mastery",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/guild/guild.skill_levels.icon.png"),
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
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/guild/guild.cost.icon.png"),
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
    sanitarium: {
      name: "Sanitarium",
      iconUrl: require("../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.icon_roster.png"),
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.character.png"),
      slotImageUrl: require(
        "../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.locked_hero_slot_overlay.png"
      ),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.character_background.png"
      ),
      children: {
        quirks: {
          name: "Treatment Ward",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.cost.icon.png"),
          description: "Treat Quirks and other problematic behaviors.",
          items: [
            {cost: null, effects: {size: 1, cost: 500, treatFlaw: 1}},
            {cost: {[HeirloomType.Deed]: 3, [HeirloomType.Crest]: 4}, effects: {size: 1}},
            {cost: {[HeirloomType.Deed]: 4, [HeirloomType.Crest]: 7}, effects: {cost: -100}},
            {cost: {[HeirloomType.Deed]: 6, [HeirloomType.Crest]: 8}, effects: {size: 1}}
          ]
        },
        diseases: {
          name: "Medical Ward",
          avatarUrl: require(
            "../../assets/dd/images/campaign/town/buildings/sanitarium/sanitarium.disease_quirk_cost.icon.png"
          ),
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
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.character.png"),
      backgroundUrl: require(
        "../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.character_background.png"
      ),
      description: "Upgrading the Stage Coach increases the available" +
      " heroes for hire each week or increases your roster size.",
      children: {
        network: {
          name: "Stagecoach Network",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.icon.png"),
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
          avatarUrl: require(
            "../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.rostersize.icon.png"
          ),
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
          avatarUrl: require(
            "../../assets/dd/images/campaign/town/buildings/stage_coach/stage_coach.upgraded_recruits.icon.png"
          ),
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
      iconUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.icon_roster.png"),
      avatarUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.character.png"),
      slotImageUrl: require(
        "../../assets/dd/images/campaign/town/buildings/tavern/tavern.locked_hero_slot_overlay.png"
      ),
      backgroundUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.character_background.png"),
      description: "Upgrading the Tavern increases the number of available stress treatments and their effectiveness",
      children: {
        bar: {
          name: "Bar",
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.bar.icon.png"),
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
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.gambling.icon.png"),
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
          avatarUrl: require("../../assets/dd/images/campaign/town/buildings/tavern/tavern.brothel.icon.png"),
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
      avatarUrl: require("../../assets/dd/images/campaign/town/provision/provision.icon.png"),
      npcImageUrl: require("../../assets/dd/images/campaign/town/provision/provision.character.png"),
      backgroundUrl: require("../../assets/dd/images/campaign/town/provision/provision.character_background.png")
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
    if (info.type === undefined) {
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
