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
import {enumMap} from "../lib/Helpers";
import {maxSelectedSkills} from "../config/general";
import {ItemType} from "./types/ItemInfo";

export function generateMonster (dungeonInfo: DungeonInfo, activeMonsters: Character[]): Character {
  const template = randomizeTemplate(dungeonInfo.monsters, activeMonsters);
  return decorateCharacter(new Character(), template);
}

export function generateHero (activeHeroes: Hero[]): Hero {
  const allTemplates = StaticState.instance.heroes;
  const template = randomizeTemplate(allTemplates, activeHeroes);

  return decorateCharacter(new Hero(), template);
}

export function decorateCharacter<T extends Character> (c: T, template: CharacterTemplate): T {
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

  c.resetMutableStats();
  return c;
}

export function generateItem (): Item {
  const t = new Item();
  t.info = randomizeItem(StaticState.instance.items);
  return t;
}

export function generateQuest (dungeons: Dungeon[]): Quest {
  const q = new Quest();
  const dungeon = randomizeItem(dungeons);
  q.dungeonId = dungeon.id;
  q.level = dungeon.level.number;
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

export function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}

export function randomizeItems<T> (items: T[], min: number = 1, max: number = items.length): T[] {
  if (max > items.length) {
    max = items.length;
  }
  if (min > items.length) {
    min = items.length;
  }

  let amount = min + Math.floor(Math.random() * (max - min));
  const itemsLeft = items.slice();
  const selectedItems: T[] = [];
  while (amount-- > 0) {
    const index = Math.floor(itemsLeft.length * Math.random());
    selectedItems.push(itemsLeft.splice(index, 1)[0]);
  }
  return selectedItems;
}
