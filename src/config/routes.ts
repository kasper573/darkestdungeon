import {Route} from "../RouterState";
import {Start} from "../Start";
import {Loading} from "../Loading";
import {EstateOverview} from "../EstateOverview";
import {EstateDungeons} from "../EstateDungeons";
import {EstateProvision} from "../EstateProvision";
import {Dungeon} from "../Dungeon";
import {DungeonResult} from "../DungeonResult";
import {SoundTester} from "../SoundTester";
import {PopupTester} from "../PopupTester";

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
