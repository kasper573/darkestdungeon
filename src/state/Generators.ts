import {StaticState} from "./StaticState";
import {Hero} from "./types/Hero";
import {Item} from "./types/Item";
import {Dungeon} from "./types/Dungeon";
import {Quest} from "./types/Quest";
import {MapSize, QuestMap} from "./types/QuestMap";
import {QuestObjective} from "./types/QuestObjective";

export class HeroGenerator {
  next (): Hero {
    const c = new Hero();
    c.name = randomizeItem(StaticState.instance.heroNames);
    c.classInfo = randomizeItem(Array.from(StaticState.instance.heroClasses.values()));
    c.affliction = randomizeItem(Array.from(StaticState.instance.afflictions.values()));
    c.diseases = randomizeItems(Array.from(StaticState.instance.diseases.values()), 1, 3);
    c.quirks = randomizeItems(Array.from(StaticState.instance.quirks.values()), 1, 8);
    c.skills = randomizeItems(Array.from(StaticState.instance.skills.values()), 4, 4);
    c.resetMutableStats();
    return c;
  }
}

export class ItemGenerator {
  next (): Item {
    const t = new Item();
    t.info = randomizeItem(Array.from(StaticState.instance.items.values()));
    return t;
  }
}

export class QuestGenerator {
  next (dungeons: Dungeon[]): Quest {
    const itemPool = Array.from(StaticState.instance.items.values());

    const q = new Quest();
    const dungeon = randomizeItem(dungeons);
    q.dungeonId = dungeon.id;
    q.level = dungeon.level.number;
    q.bonfires = Math.round(Math.random() * 2);
    q.map = QuestMap.generate(
      randomizeItem(Object.values(MapSize)) as MapSize
    );

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
