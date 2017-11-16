import {StaticState} from "../state/StaticState";
import {DungeonInfo} from "../state/static/DungeonInfo";
import {LevelInfo} from "../state/static/LevelInfo";
import {AfflictionInfo} from "../state/static/AfflictionInfo";
import {CharacterClassInfo} from "../state/static/CharacterClassInfo";
import {ItemInfo} from "../state/static/ItemInfo";

export const defaultAmbienceOSVolume = 0.25;

export const todo = "?todo?";

export function addStaticState () {
  StaticState.instance.heroNames = [
    "CoffeeDetective", "Gr4nnysith", "Koob0", "Kvilex", "PuzzleDev"
  ];

  ["Excalibur", "Large beer", "Teddy bear", "Unicorn", "Potato"].forEach((name, index) => {
    const info = new ItemInfo();
    info.id = name;
    info.name = name;
    info.goldCost = 25 + 50 * index;
    StaticState.instance.items.set(info.id, info);
  });

  ["Ninja", "Superhero", "Magician", "Baller", "Chad"].forEach((className) => {
    const info = new CharacterClassInfo();
    info.id = className;
    info.name = className;
    StaticState.instance.heroClasses.set(info.id, info);
  });

  ["Hopeless", "Paranoid", "Gullible", "Ignorant"].forEach((name) => {
    const info = new AfflictionInfo();
    info.id = name;
    info.name = name;
    StaticState.instance.afflictions.set(info.id, info);
  });

  ["Seeker", "Apprentice", "Pretty Cool", "Kickass", "Badass", "Master", "Grand Master"]
    .forEach((name, level) => {
      const info = new LevelInfo();
      info.id = level;
      info.number = level;
      info.name = name;
      info.experience = Math.pow(level, 2) * 1000;
      StaticState.instance.levels.set(info.id, info);
    });

  for (let level = 0; level < StaticState.instance.levels.size; level++) {
    const info = StaticState.instance.levels.get(level);
    info.previous = StaticState.instance.levels.get(this.id - 1);
    info.next = StaticState.instance.levels.get(this.id + 1);
  }

  ["Ruins", "Warrens", "Weald", "Cove", "Dankest Dungeon"].forEach((name) => {
    const info = new DungeonInfo();
    info.id = name;
    info.name = name;
    StaticState.instance.dungeons.set(info.id, info);
  });
}
