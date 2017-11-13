import {Character, Item} from "./ProfileState";
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

function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}
