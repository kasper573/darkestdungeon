import {RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";

export class AppState {
  private isInitialized: boolean;

  public router: RouterState;
  public ambience: AmbienceState;
  public music: MusicState;

  initialize (
    router: RouterState,
    ambience: AmbienceState,
    music: MusicState
  ) {
    if (this.isInitialized) {
      throw new Error("AppState has already been initialized");
    }

    this.router = router;
    this.ambience = ambience;
    this.music = music;
    this.isInitialized = true;
  }
}
