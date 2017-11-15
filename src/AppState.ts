import {Path, Route, RouterState} from "./RouterState";
import {AmbienceState} from "./AmbienceState";
import {MusicState} from "./MusicState";
import {PopupState} from "./PopupState";
import {IReactionDisposer, reaction} from "mobx";
import {Profile, ProfileState} from "./ProfileState";
import {OptionsState} from "./OptionsState";
import {HeroGenerator, ItemGenerator, QuestGenerator} from "./Generators";
import {deserialize, serialize} from "serializr";
import {UIState} from "./UIState";

export class AppState {
  private reactionDisposers: IReactionDisposer[];

  public heroGenerator = new HeroGenerator();
  public itemGenerator = new ItemGenerator();
  public questGenerator = new QuestGenerator();

  public ui: UIState = new UIState();
  public router: RouterState = new RouterState();
  public ambience: AmbienceState = new AmbienceState();
  public music: MusicState = new MusicState();
  public popups: PopupState = new PopupState();
  public options: OptionsState = new OptionsState();
  public profiles: ProfileState = new ProfileState(
    this.heroGenerator,
    this.itemGenerator,
    this.questGenerator
  );

  public isRunningJest: boolean; // HACK ugly workaround

  /**
   * Starts composite state behavior
   */
  initialize () {
    this.load();

    let previousPath = this.router.path;
    this.reactionDisposers = [
      // Path changes
      reaction(
        () => [this.router.path, this.router.route],
        ([path, route]: [Path, Route]) => {
          // Close all popups as soon as the path changes.
          // This avoids popups staying visible during screen transitions.
          if (previousPath.value !== path.value) {
            this.popups.closeAll();
          }
          previousPath = path;

          // Update memorized path for active profile
          if (route.isMemorable) {
            this.profiles.activeProfile.path = path;
          }

          // Change music and ambience
          console.log("Changing music and ambience for path", path.value, path.args);
          this.ambience.activate(route.ambience(this, path));
          this.music.play(route.music(this, path));
        }
      ),
      // Save whenever interesting data changes
      reaction(
        () => {
          return {
            path: this.router.path.value,
            profiles: Array.from(this.profiles.map.values()).map((p) => [
              p.name,
              p.isNameFinalized
            ])
          };
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
