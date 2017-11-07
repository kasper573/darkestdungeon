import {RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";

export class AppState {
  private isInitialized: boolean;

  public router: RouterState;
  public ambience: AmbienceState;

  initialize (router: RouterState, ambience: AmbienceState) {
    if (this.isInitialized) {
      throw new Error("AppState has already been initialized");
    }

    this.router = router;
    this.ambience = ambience;
    this.isInitialized = true;
  }
}
