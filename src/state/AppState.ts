import {RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";
import {ProfileState} from "./ProfileState";
import {OptionsState} from "./OptionsState";
import {deserialize, serialize} from "serializr";
import {AppBounds} from "../AppBounds";
import {Difficulty, Profile} from "./types/Profile";
import {Route} from "./types/Route";
import {Path} from "./types/Path";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public bounds: AppBounds = new AppBounds();
  public router: RouterState = new RouterState();
  public ambience: AmbienceState = new AmbienceState();
  public music: MusicState = new MusicState();
  public popups: PopupState = new PopupState();
  public options: OptionsState = new OptionsState();
  public profiles: ProfileState = new ProfileState();

  public isRunningJest: boolean; // HACK ugly workaround

  /**
   * Starts composite state behavior
   */
  initialize () {
    let previousPath = this.router.path;
    this.reactionDisposers = [
      // Path changes
      reaction(
        () => [this.router.path, this.router.route],
        ([path, route]: [Path, Route, Route]) => {
          // Close all popups as soon as the path changes.
          // This avoids popups staying visible during screen transitions.
          if (previousPath.root !== path.root) {
            this.popups.closeAll();
          }
          previousPath = path;

          // Update memorized path for active profile
          if (route.isMemorable) {
            this.profiles.activeProfile.path = new Path(path.value);
          }

          // Change music and ambience
          this.ambience.activate(route.ambience(this, path));
          this.music.play(route.music(this, path));
        }
      ),
      // Save whenever interesting data changes
      reaction(
        () => {
          return {
            profiles: Array.from(this.profiles.map.values()).map((p) => [
              p.name,
              p.isNameFinalized,
              p.path,
              p.estateEvent,
              p.estateEvent.shown
            ])
          };
        },
        () => this.save()
      )
    ];
  }

  ensureProfile () {
    if (this.profiles.map.size === 0) {
      const nullProfile = this.profiles.createProfile(Difficulty.Radiant);
      nullProfile.name = "Null";
      nullProfile.isNameFinalized = true;
    }

    // Activate the first profile
    this.profiles.setActiveProfile(Array.from(this.profiles.map.keys())[0]);
  }

  save () {
    const jsProfileList = [];
    for (const profile of this.profiles.map.values()) {
      jsProfileList.push(serialize(profile));
    }

    localStorage.setItem("profileList", JSON.stringify(jsProfileList));
  }

  load () {
    const rawProfileList = localStorage.getItem("profileList");
    if (rawProfileList) {
      try {
        const jsProfileList = JSON.parse(rawProfileList);

        const profileList = [];
        for (const jsProfile of jsProfileList) {
          const profile = deserialize(Profile, jsProfile);
          profileList.push(profile);
          this.profiles.addProfile(profile);
        }
      } catch (e) {
        console.error("Unable to parse localStorage data: " + e);
      }
    }
  }

  /**
   * Ends composite state behavior
   */
  dispose () {
    this.reactionDisposers.forEach((dispose) => dispose());
  }
}
