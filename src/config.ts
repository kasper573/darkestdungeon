import {Start} from "./Start";
import {Loading} from "./Loading";
import {SoundTester} from "./SoundTester";
import {AmbienceDefinition} from "./AmbienceState";
import {PopupTester} from "./PopupTester";
import {EstateOverview} from "./EstateOverview";
import {EstateDungeons} from "./EstateDungeons";
import {EstateProvision} from "./EstateProvision";
import {Dungeon} from "./Dungeon";
import {DungeonResult} from "./DungeonResult";
import {Route} from "./RouterState";

// The map of all screens available in the game, mapped to their route name.
export const routes = {
  "start": new Route(Start, false),
  "loading": new Route(Loading, false),
  "estateOverview": new Route(EstateOverview),
  "estateDungeons": new Route(EstateDungeons),
  "estateProvision": new Route(EstateProvision),
  "dungeon": new Route(Dungeon),
  "dungeonResult": new Route(DungeonResult),
  "soundTester": new Route(SoundTester, false),
  "popupTester": new Route(PopupTester, false)
};

export const ambience = {
  "estate": new AmbienceDefinition(
    {src: require("../assets/dd/audio/amb_town_gen_base.wav")},
    [
      {src: require("../assets/dd/audio/amb_town_gen_base_os_01.wav")},
      {src: require("../assets/dd/audio/amb_town_gen_base_os_02.wav")},
      {src: require("../assets/dd/audio/amb_town_gen_base_os_03.wav")}
    ]
  ),
  "coach": "estate",
  "tavern": new AmbienceDefinition(
    {src: require("../assets/dd/audio/amb_town_tavern.wav")},
    [
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_01.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_02.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_03.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_01.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_02.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_03.wav")}
    ]
  ),
};
