import {Path, Route, RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";
import {ProfileState} from "./ProfileState";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public router: RouterState = new RouterState();
  public ambience: AmbienceState = new AmbienceState();
  public music: MusicState = new MusicState();
  public popups: PopupState = new PopupState();
  public profiles: ProfileState = new ProfileState();

  public isRunningJest: boolean; // HACK ugly workaround

  constructor () {
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
