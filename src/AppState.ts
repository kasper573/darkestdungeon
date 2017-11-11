import {Path, Route, RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";
import {AdventureStatus, EstateEvent, Profile, ProfileState} from "./ProfileState";
import {OptionsState} from "./OptionsState";
import {CharacterGenerator, ItemGenerator} from "./Generators";
import {deserialize, serialize} from "serializr";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public characterGenerator = new CharacterGenerator();
  public itemGenerator = new ItemGenerator();
  public router: RouterState = new RouterState();
  public ambience: AmbienceState = new AmbienceState();
  public music: MusicState = new MusicState();
  public popups: PopupState = new PopupState();
  public options: OptionsState = new OptionsState();
  public profiles: ProfileState = new ProfileState(
    this.characterGenerator,
    this.itemGenerator
  );

  public isRunningJest: boolean; // HACK ugly workaround

  /**
   * Starts composite state behavior
   */
  initialize () {
    this.load();
    this.reactionDisposers = [
      // Path changes
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
      ),
      // Adventure status changes
      reaction(
        () => {
          return this.profiles.activeProfile.adventure ?
            this.profiles.activeProfile.adventure.status :
            AdventureStatus.Pending;
        },
        (status) => {
          // Randomize estate event every time an adventure is finished
          if (status !== AdventureStatus.Pending) {
            const eventIndex = Math.floor(100 * Math.random());
            const newEvent = new EstateEvent();
            newEvent.message = "Event " + eventIndex;
            this.profiles.activeProfile.estateEvent = newEvent;
          }
        }
      ),
      // Save whenever interesting data changes
      reaction(
        () => {
          return JSON.stringify({
            path: this.router.path.value,
            numProfiles: this.profiles.map.size
          });
        },
        () => this.save()
      )
    ];
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
    this.save();
    this.reactionDisposers.forEach((dispose) => dispose());
  }
}
