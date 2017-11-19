import {Path, Route} from "../state/RouterState";
import {Start} from "../screens/start/Start";
import {Loading} from "../screens/Loading";
import {EstateOverview} from "../screens/estate/EstateOverview";
import {EstateDungeons} from "../screens/estate/EstateDungeons";
import {EstateProvision} from "../screens/estate/EstateProvision";
import {DungeonResult} from "../screens/dungeon/DungeonResult";
import {BarkTester} from "../screens/BarkTester";
import {PopupTester} from "../screens/PopupTester";
import {AmbienceDefinition} from "../state/AmbienceState";
import {AppState} from "../state/AppState";
import {DungeonOverview} from "../screens/dungeon/DungeonOverview";
import {StageCoach} from "../screens/estate/buildings/StageCoach";
import {Graveyard} from "../screens/estate/buildings/Graveyard";
import {Tavern} from "../screens/estate/buildings/Tavern";
import {Sanitarium} from "../screens/estate/buildings/Sanitarium";
import {Abbey} from "../screens/estate/buildings/Abbey";
import {Guild} from "../screens/estate/buildings/Guild";
import {Blacksmith} from "../screens/estate/buildings/Blacksmith";
import {Memoirs} from "../screens/estate/buildings/Memoirs";
import {StatsTester} from "../screens/StatsTester";

export const defaultEstateAmbience = new AmbienceDefinition(
  {src: require("../../assets/dd/audio/amb_town_gen_base.wav")},
  [
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_01.wav")},
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_02.wav")},
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_03.wav")}
  ]
);

const loadingRerouter = (fromPath: Path, toPath: Path) => {
  if (!toPath.args.bypassRerouter) {
    return new Path("loading", {
      target: new Path(
        toPath.value, {
          ...toPath.args,
          bypassRerouter: true
        }
      ),
    });
  }
};

const estateLoadingRerouter = (from: Path, to: Path) => {
  if (!/^estate/.test(from.value)) {
    return loadingRerouter(from, to);
  }
};

export const routes: {[key: string]: Route} = {
  start: new Route({
    component: Start,
    isMemorable: false,
    music: () => require("../../assets/dd/audio/mus_theme_loop.wav")
  }),

  loading: new Route({
    component: Loading,
    isMemorable: false
  }),

  estateOverview: new Route({
    rerouter: estateLoadingRerouter,
    component: EstateOverview,
    music: () => {
      return {
        src: require("../../assets/dd/audio/mus_town_stemmed.wav"),
        volume: 0.25
      };
    },
    ambience: () => defaultEstateAmbience,
    children: {
      "StageCoach": new Route({component: StageCoach}),
      "Graveyard": new Route({
        component: Graveyard,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_graveyard.wav")},
          [
            {src: require("../../assets/dd/audio/amb_town_graveyard_os_01.wav")},
            {src: require("../../assets/dd/audio/amb_town_graveyard_os_02.wav")},
            {src: require("../../assets/dd/audio/amb_town_graveyard_os_03.wav")}
          ]
        )
      }),
      "Tavern": new Route({
        component: Tavern,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_tavern.wav")},
          [
            {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_01.wav")},
            {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_02.wav")},
            {src: require("../../assets/dd/audio/amb_town_tavern_os_bar_03.wav")},
            {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_01.wav")},
            {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_02.wav")},
            {src: require("../../assets/dd/audio/amb_town_tavern_os_chair_03.wav")}
          ]
        )
      }),
      "Sanitarium": new Route({
        component: Sanitarium,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_sanitarium.wav")},
          [
            {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_01.wav")},
            {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_02.wav")},
            {src: require("../../assets/dd/audio/amb_town_sanitarium_os_gen_03.wav")}
          ]
        )
      }),
      "Abbey": new Route({
        component: Abbey,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_abbey.wav")},
          [
            {src: require("../../assets/dd/audio/amb_town_abbey_os_chants.wav")},
            {src: require("../../assets/dd/audio/amb_town_abbey_os_whispers.wav")}
          ]
        )
      }),
      "Guild": new Route({
        component: Guild,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_guild.wav")}
        )
      }),
      "Blacksmith": new Route({
        component: Blacksmith,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_blacksmith.wav")},
          [
            {src: require("../../assets/dd/audio/amb_town_blacksmith_os_01.wav")},
            {src: require("../../assets/dd/audio/amb_town_blacksmith_os_02.wav")},
            {src: require("../../assets/dd/audio/amb_town_blacksmith_os_03.wav")}
          ]
        )
      }),
      "Memoirs": new Route({
        component: Memoirs,
        ambience: () => new AmbienceDefinition(
          {src: require("../../assets/dd/audio/amb_town_tavern.wav")}
        )
      }),
    }
  }),

  estateDungeons: new Route({
    rerouter: estateLoadingRerouter,
    component: EstateDungeons,
    music: () => routes.estateOverview.music.apply(this, arguments),
    ambience: () => new AmbienceDefinition(
      {src: require("../../assets/dd/audio/amb_town2_gen_base.wav")},
      [
        {src: require("../../assets/dd/audio/amb_town2_gen_base_os_01.wav")},
        {src: require("../../assets/dd/audio/amb_town2_gen_base_os_02.wav")},
        {src: require("../../assets/dd/audio/amb_town2_gen_base_os_03.wav")}
      ]
    )
  }),

  estateProvision: new Route({
    rerouter: estateLoadingRerouter,
    component: EstateProvision,
    music: () => routes.estateDungeons.music.apply(this, arguments),
    ambience: () => routes.estateDungeons.ambience.apply(this, arguments)
  }),

  dungeonOverview: new Route({
    rerouter: loadingRerouter,
    component: DungeonOverview,
    ambience: () => require("../../assets/dd/audio/amb_dun_weald_base.wav"),
    music: (state: AppState) => {
      if (state.profiles.activeProfile.selectedQuest.battle) {
        return require("../../assets/dd/audio/mus_combat_hallway_part_a.wav");
      }
    }
  }),

  dungeonResult: new Route({
    component: DungeonResult,
    isMemorable: false
  }),

  barkTester: new Route({
    component: BarkTester,
    isMemorable: false
  }),

  popupTester: new Route({
    component: PopupTester,
    isMemorable: false
  }),

  statsTester: new Route({
    component: StatsTester,
    isMemorable: false
  })
};
