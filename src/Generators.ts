import {Profile, Character, CharacterClass, Trinket} from "./ProfileState";

export class CharacterGenerator {
  private names: string[] = [];
  private classes: CharacterClass[] = [];

  configure (names: string[], classes: CharacterClass[]) {
    this.names = names;
    this.classes = classes;
  }

  next (profile: Profile): Character {
    return new Character(
      undefined,
      randomizeItem(this.names),
      randomizeItem(this.classes),
      profile
    );
  }
}

export class ItemGenerator {
  private names: string[] = [];

  configure (names: string[]) {
    this.names = names;
  }

  nextTrinket (): Trinket {
    return new Trinket(
      undefined,
      randomizeItem(this.names)
    );
  }
}

function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}
