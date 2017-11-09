import {Path, Route, RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";
import {ProfileState} from "./ProfileState";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public router: RouterState;
  public ambience: AmbienceState;
  public music: MusicState;
  public popups: PopupState;
  public profiles: ProfileState;

  public isRunningJest: boolean; // HACK ugly workaround

  initialize (
    router: RouterState,
    ambience: AmbienceState,
    music: MusicState,
    popups: PopupState,
    profiles: ProfileState
  ) {
    // Don't allow overriding state
    this.router = this.router || router;
    this.ambience = this.ambience || ambience;
    this.music = this.music || music;
    this.popups = this.popups || popups;
    this.profiles = this.profiles || profiles;

    // Composite state behavior
    this.reactionDisposers = [
      reaction(
        () => [this.router.path, this.router.route],
        ([path, route]: [Path, Route]) => {
          // Close all popups as soon as the path changes.
          // This avoids popups staying visible during screen transitions.
          this.popups.closeAll();

          // Update memorized path for active profile
          if (route.isMemorable) {
            this.profiles.activeProfile.path = path;
          }
        }
      )
    ];
  }

  dispose () {
    this.reactionDisposers.forEach((dispose) => dispose());
  }
}
