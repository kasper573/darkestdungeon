import {AmbienceDefinition} from "../AmbienceState";
import {identifier, serializable} from "serializr";

export const ambience = {
  "estateOverview": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_gen_base.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_03.wav")}
    ]
  ),
  "estateDungeons": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town2_gen_base.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town2_gen_base_os_01.wav")},
      {src: require("../../assets/dd/audio/amb_town2_gen_base_os_02.wav")},
      {src: require("../../assets/dd/audio/amb_town2_gen_base_os_03.wav")}
    ]
  ),
  "estateProvision": "estateDungeons",
  "coach": "estateOverview",
  "graveyard": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_graveyard.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_graveyard_os_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_graveyard_os_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_graveyard_os_03.wav")}
    ]
  ),
  "tavern": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_tavern.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_03.wav")},
      {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_03.wav")}
    ]
  ),
  "sanitarium": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_sanitarium.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_03.wav")}
    ]
  ),
  "abbey": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_abbey.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_abbey_os_chants.wav")},
      {src: require("../../assets/dd/audio/amb_town_abbey_os_whispers.wav")}
    ]
  ),
  "guild": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_guild.wav")}
  ),
  "blacksmith": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_blacksmith.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_blacksmith_os_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_blacksmith_os_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_blacksmith_os_03.wav")}
    ]
  ),
  "memoirs": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_tavern.wav")}
  ),
};

// Lower all os to 0.25 volume
for (const key in ambience) {
  const def = (ambience as any)[key] as AmbienceDefinition;
  if (def.os) {
    def.os.forEach(
      (o: IHowlProperties) => o.volume = 0.25
    );
  }
}

export const characterNames = ["CoffeeDetective", "Gr4nnysith", "Koob0", "Kvilex", "PuzzleDev"];

export enum ItemType {
  Weapon = "W",
  Armor = "A",
  Trinket = "T",
  Usable = "T"
}

export class ItemInfo {
  @serializable(identifier()) id: string;
  static lookup = new Map<string, ItemInfo>();
  static lookupFn = lookupFn.bind(null, ItemInfo.lookup);

  constructor (
    public name: string = "",
    public type: ItemType = ItemType.Usable
  ) {}
}

export class CharacterClassInfo {
  @serializable(identifier()) id: string;
  static lookup = new Map<string, CharacterClassInfo>();
  static lookupFn = lookupFn.bind(null, CharacterClassInfo.lookup);

  name: string;
  avatarUrl: string = require("../../assets/images/hero.png");
}

export class AfflictionInfo {
  @serializable(identifier()) id: string;
  static lookup = new Map<string, AfflictionInfo>();
  static lookupFn = lookupFn.bind(null, AfflictionInfo.lookup);

  name: string;
}

export class LevelInfo {
  @serializable(identifier()) id: number;
  static lookup = new Map<number, LevelInfo>();
  static lookupFn = lookupFn.bind(null, LevelInfo.lookup);

  name: string;
  number: number;
  experience: number;

  get previous () { return LevelInfo.lookup.get(this.id - 1); }
  get next () { return LevelInfo.lookup.get(this.id + 1); }
  get isMax () { return !this.next; }

  get relativeExperience () {
    const from = this.previous ? this.previous.experience : 0;
    return this.experience - from;
  }
}

export const todo = "?todo?";

["Excalibur", "Large beer", "Teddy bear", "Unicorn", "Potato"].forEach((name) => {
  const info = new ItemInfo();
  info.id = name;
  info.name = name;
  ItemInfo.lookup.set(info.id, info);
});

["Ninja", "Superhero", "Magician", "Baller", "Chad"].forEach((className) => {
  const info = new CharacterClassInfo();
  info.id = className;
  info.name = className;
  CharacterClassInfo.lookup.set(info.id, info);
});

["Hopeless", "Paranoid", "Gullible", "Ignorant"].forEach((name) => {
  const info = new AfflictionInfo();
  info.id = name;
  info.name = name;
  AfflictionInfo.lookup.set(info.id, info);
});

["Seeker", "Apprentice", "Pretty Cool", "Kickass", "Badass", "Master", "Grand Master"]
  .forEach((name, level) => {
    const info = new LevelInfo();
    info.id = level;
    info.number = level;
    info.name = name;
    info.experience = Math.pow(level, 2) * 1000;
    LevelInfo.lookup.set(info.id, info);
  });

function lookupFn <T> (lookup: Map<string, T>, id: string, resolve: (e: any, r: any) => void) {
  resolve(null, lookup.get(id));
}

export enum StatsModSource {
  Affliction = "Affliction",
  Item = "Item",
  Quirk = "Quirk"
}

export type StatsValue = number[] | number;
export type StatsMod  = {units?: number, percentages?: number, source: StatsModSource};

export class StatsInfo {
  constructor (
    public shortName: string,
    public longName: string,
    public value: StatsValue,
    public mods: StatsMod[] = [],
    public isPercentage: boolean = false
  ) {}
}

export class QuirkInfo {
  constructor (
    public name: string,
    public isPositive: boolean = true
  ) {}
}
