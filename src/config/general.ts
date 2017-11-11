import {AmbienceDefinition} from "../AmbienceState";
import {identifier, serializable} from "serializr";

export const ambience = {
  "estate": new AmbienceDefinition(
    {src: require("../../assets/dd/audio/amb_town_gen_base.wav")},
    [
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_01.wav")},
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_02.wav")},
      {src: require("../../assets/dd/audio/amb_town_gen_base_os_03.wav")}
    ]
  ),
  "coach": "estate",
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
};

export const characterNames = ["CoffeeDetective", "Gr4nnysith", "Koob0", "Kvilex", "PuzzleDev"];

export class ItemInfo {
  @serializable(identifier()) id: string;
  static lookup = new Map<string, ItemInfo>();
  static lookupFn = lookupFn.bind(null, ItemInfo.lookup);

  name: string;
}

export class CharacterClassInfo {
  @serializable(identifier()) id: string;
  static lookup = new Map<string, CharacterClassInfo>();
  static lookupFn = lookupFn.bind(null, CharacterClassInfo.lookup);

  name: string;
}

["Excalibur", "Large beer", "Teddy bear", "Unicorn", "Potato"].forEach((name) => {
  const info = new ItemInfo();
  info.id = name;
  info.name = name;
  ItemInfo.lookup.set(info.id, info);
});

["Ninja", "Superhero", "Magician", "Bowling Baller", "Chad"].forEach((name) => {
  const info = new CharacterClassInfo();
  info.id = name;
  info.name = name;
  CharacterClassInfo.lookup.set(info.id, info);
});

function lookupFn <T> (lookup: Map<string, T>, id: string, resolve: (e: any, r: any) => void) {
  resolve(null, lookup.get(id));
}
