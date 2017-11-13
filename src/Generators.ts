import {Character, Dungeon, Item, MapSize, Quest, QuestObjective} from "./ProfileState";
import {AfflictionInfo, CharacterClassInfo, characterNames, ItemInfo} from "./config/general";

export class CharacterGenerator {
  next (): Character {
    const c = new Character();
    c.name = randomizeItem(characterNames);
    c.classInfo = randomizeItem(Array.from(CharacterClassInfo.lookup.values()));
    c.affliction = randomizeItem(Array.from(AfflictionInfo.lookup.values()));
    c.stress = Math.floor(Math.random() * c.stressMax);
    return c;
  }
}

export class ItemGenerator {
  next (): Item {
    const t = new Item();
    t.itemInfo = randomizeItem(Array.from(ItemInfo.lookup.values()));
    return t;
  }
}

export class QuestGenerator {
  next (dungeons: Dungeon[]): Quest {
    const itemPool = Array.from(ItemInfo.lookup.values());

    const q = new Quest();
    const dungeon = randomizeItem(dungeons);
    q.dungeonId = dungeon.id;
    q.level = dungeon.level.number;
    q.bonfires = Math.round(Math.random() * 2);
    q.mapSize = randomizeItem(Object.values(MapSize)) as MapSize;

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

function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}
