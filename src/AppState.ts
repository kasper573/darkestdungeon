import {RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public router: RouterState;
  public ambience: AmbienceState;
  public music: MusicState;
  public popups: PopupState;

  initialize (
    router: RouterState,
    ambience: AmbienceState,
    music: MusicState,
    popups: PopupState
  ) {
    // Don't allow overriding state
    this.router = this.router || router;
    this.ambience = this.ambience || ambience;
    this.music = this.music || music;
    this.popups = this.popups || popups;

    // Close all popups as soon as the location changes.
    // This avoids popups staying visible during screen transitions.
    this.reactionDisposers = [
      reaction(() => this.router.location, () => this.popups.closeAll())
    ];
  }

  dispose () {
    this.reactionDisposers.forEach((dispose) => dispose());
  }
}
