import {AmbienceDefinition} from "../AmbienceState";
import {AfflictionInfo, CharacterClassInfo, DungeonInfo, ItemInfo, LevelInfo, StaticState} from "../StaticState";

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

  ["Ruins", "Warrens", "Weald", "Cove", "Dankest Dungeon"].forEach((name) => {
    const info = new DungeonInfo();
    info.id = name;
    info.name = name;
    StaticState.instance.dungeons.set(info.id, info);
  });
}
