import {StaticState} from "./StaticState";
import {Hero} from "./types/Hero";
import {Item} from "./types/Item";
import {Dungeon} from "./types/Dungeon";
import {Quest} from "./types/Quest";
import {MapSize, QuestMap} from "./types/QuestMap";
import {QuestObjective} from "./types/QuestObjective";
import {Character} from "./types/Character";
import {DungeonInfo} from "./types/DungeonInfo";
import {CharacterTemplate} from "./types/CharacterTemplate";
import {enumMap, randomizeItem, randomizeItems} from "../lib/Helpers";
import {maxSelectedSkills} from "../config/general";
import {ItemType} from "./types/ItemInfo";
import {Curio} from "./types/Curio";
import {TurnStats} from "./types/Stats";

export function generateMonster (dungeonInfo: DungeonInfo, activeMonsters: Character[], level = 0): Character {
  const template = randomizeTemplate(dungeonInfo.monsters, activeMonsters);
  return decorateCharacter(new Character(), template, level);
}

export function generateHero (activeHeroes: Hero[], level = 0): Hero {
  const allTemplates = StaticState.instance.heroes;
  const template = randomizeTemplate(allTemplates, activeHeroes);

  return decorateCharacter(new Hero(), template, level);
}

export function decorateCharacter<T extends Character> (c: T, template: CharacterTemplate, level: number): T {
  c.name = randomizeItem(template.characterNames);
  c.classInfo = template.classInfo;
  c.affliction = randomizeItem(StaticState.instance.afflictions);
  c.quirks = randomizeItems(StaticState.instance.quirks, 1, 8);

  const allItems = StaticState.instance.items;
  const weapons = allItems.filter((item) => item.type === ItemType.Weapon);
  const armors = allItems.filter((item) => item.type === ItemType.Armor);

  c.items = [
    Item.fromInfo(randomizeItem(weapons)),
    Item.fromInfo(randomizeItem(armors))
  ];

  randomizeItems(c.skills, maxSelectedSkills, maxSelectedSkills).forEach((skill) => {
    skill.level++;
    skill.isSelected = true;
  });

  c.experience = StaticState.instance.levels.find((l) => l.number === level).experience;

  c.resetMutableStats();
  return c;
}

export function generateCurio (): Curio {
  const curio = new Curio();
  const type = Math.floor(Math.random() * 2.999);
  const isPositive = Math.random() > 0.5;

  switch (type) {
    // Items
    case 0:
      curio.items = randomizeItems(StaticState.instance.items, 1, 3).map(Item.fromInfo);
      break;

    // Buff
    case 1:
      curio.buff = generateBuff(isPositive ? 1 : -1);
      break;

    // Quirks
    case 2:
      const quirkPool = StaticState.instance.quirks.filter((q) => q.stats.isPositive === isPositive);
      curio.quirk = randomizeItem(quirkPool);
      break;
  }

  return curio;
}

export function generateBuff (multiplier: number) {
  const buff = new TurnStats();
  buff.resistances.forEach((stat) => {
    stat.value = multiplier * 0.1;
  });
  return buff;
}

export function generateQuest (dungeons: Dungeon[]): Quest {
  const q = new Quest();
  const dungeon = randomizeItem(dungeons);
  q.dungeonId = dungeon.id;
  q.bonfires = Math.round(Math.random() * 2);
  q.map = QuestMap.generate(
    dungeon.info,
    randomizeItem(Array.from(enumMap<MapSize>(MapSize).values()))
  );
  q.changeRoom(q.map.entrance.id);

  q.rewards = [
    Item.fromInfo(randomizeItem(StaticState.instance.items)),
    Item.fromInfo(randomizeItem(StaticState.instance.items)),
    Item.fromInfo(randomizeItem(StaticState.instance.items))
  ];

  const o = new QuestObjective();
  if (Math.random() > 0.5) {
    o.monsterPercentage = 0.1 + Math.random() * 0.9;
    o.explorePercentage = 0.1 + Math.random() * 0.9;
  } else {
    o.monsterPercentage = 0.1 + Math.random() * 0.9;
  }
  q.objective = o;
  return q;
}

export function randomizeTemplate (allTemplates: CharacterTemplate[], activeCharacters: Character[]) {
  const activeTemplates = activeCharacters.map(
    (h) => allTemplates.find((t) => t.classInfo.id === h.classInfo.id)
  );

  // Filter out any templates marked as unique that already is active
  const templatePool = allTemplates.filter((t) => {
    return !activeTemplates.find(
      (active) => active.id === t.id && active.unique
    );
  });

  // Randomize order so we can pick the first rarity match and still have randomness
  templatePool.sort(() => Math.random () > 0.5 ? -1 : 1);

  // Find rarity match
  const rarityScore = Math.random();
  return templatePool.find((t) => rarityScore <= t.rarity);
}
