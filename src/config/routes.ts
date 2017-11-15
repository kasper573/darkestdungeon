import {Route} from "../RouterState";
import {Start} from "../Start";
import {Loading} from "../Loading";
import {EstateOverview} from "../EstateOverview";
import {EstateDungeons} from "../EstateDungeons";
import {EstateProvision} from "../EstateProvision";
import {DungeonResult} from "../DungeonResult";
import {BarkTester} from "../BarkTester";
import {PopupTester} from "../PopupTester";
import {AmbienceDefinition} from "../AmbienceState";
import {AppState} from "../AppState";
import {DungeonOverview} from "../DungeonOverview";
import {StageCoach} from "../StageCoach";
import {Graveyard} from "../Graveyard";
import {Tavern} from "../Tavern";
import {Sanitarium} from "../Sanitarium";
import {Abbey} from "../Abbey";
import {Guild} from "../Guild";
import {Blacksmith} from "../Blacksmith";
import {Memoirs} from "../Memoirs";

export const defaultEstateAmbience = new AmbienceDefinition(
  {src: require("../../assets/dd/audio/amb_town_gen_base.wav")},
  [
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_01.wav")},
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_02.wav")},
    {src: require("../../assets/dd/audio/amb_town_gen_base_os_03.wav")}
  ]
);

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
    component: EstateProvision,
    music: () => routes.estateDungeons.music.apply(this, arguments),
    ambience: () => routes.estateDungeons.ambience.apply(this, arguments)
  }),

  dungeonOverview: new Route({
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
  })
};
