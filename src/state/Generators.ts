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

export function generateMonster (dungeonInfo: DungeonInfo, activeMonsters: Character[]): Character {
  const template = randomizeTemplate(dungeonInfo.monsters, activeMonsters);
  const monster = new Character();
  monster.name = randomizeItem(template.characterNames);
  monster.classInfo = template.classInfo;
  monster.resetMutableStats();
  return monster;
}

export function generateHero (activeHeroes: Hero[]): Hero {
  const allTemplates = Array.from(StaticState.instance.heroes.values());
  const template = randomizeTemplate(allTemplates, activeHeroes);

  const hero = new Hero();
  hero.name = randomizeItem(template.characterNames);
  hero.classInfo = template.classInfo;
  hero.affliction = randomizeItem(Array.from(StaticState.instance.afflictions.values()));
  hero.diseases = randomizeItems(Array.from(StaticState.instance.diseases.values()), 1, 3);
  hero.quirks = randomizeItems(Array.from(StaticState.instance.quirks.values()), 1, 8);
  hero.resetMutableStats();
  return hero;
}

export function generateItem (): Item {
  const t = new Item();
  t.info = randomizeItem(Array.from(StaticState.instance.items.values()));
  return t;
}

export function generateQuest (dungeons: Dungeon[]): Quest {
  const itemPool = Array.from(StaticState.instance.items.values());

  const q = new Quest();
  const dungeon = randomizeItem(dungeons);
  q.dungeonId = dungeon.id;
  q.level = dungeon.level.number;
  q.bonfires = Math.round(Math.random() * 2);
  q.map = QuestMap.generate(
    dungeon.info,
    randomizeItem(Array.from(enumMap<MapSize>(MapSize).values()))
  );
  q.currentRoomId = q.map.entrance.id;

  q.rewards = [
    Item.fromInfo(randomizeItem(itemPool)),
    Item.fromInfo(randomizeItem(itemPool)),
    Item.fromInfo(randomizeItem(itemPool))
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
