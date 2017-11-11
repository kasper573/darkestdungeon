import {Character, Trinket} from "./ProfileState";

export class CharacterGenerator {
  private names: string[] = [];

  configure (names: string[]) {
    this.names = names;
  }

  next (): Character {
    const c = new Character();
    c.name = randomizeItem(this.names);
    return c;
  }
}

export class ItemGenerator {
  private names: string[] = [];

  configure (names: string[]) {
    this.names = names;
  }

  nextTrinket (): Trinket {
    const t = new Trinket();
    t.name = randomizeItem(this.names);
    return t;
  }
}

function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}
