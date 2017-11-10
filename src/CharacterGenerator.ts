import {Character, CharacterClass} from "./ProfileData";

export class CharacterGenerator {
  private names: string[] = [];
  private classes: CharacterClass[] = [];

  configure (names: string[], classes: CharacterClass[]) {
    this.names = names;
    this.classes = classes;
  }

  next (): Character {
    return new Character(
      randomizeItem(this.names),
      randomizeItem(this.classes)
    );
  }
}

function randomizeItem<T> (items: T[]): T {
  const index = Math.floor(items.length * Math.random());
  return items[index];
}
