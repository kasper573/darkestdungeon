import {AppState} from "./AppState";
import {addStaticState} from "../config/general";
import {StaticState} from "./StaticState";
import {Difficulty} from "./types/Profile";

describe("AppState", () => {
  afterEach(() => StaticState.instance.clear());

  it (`hibernates state`, () => {
    const savedState = new AppState();
    addStaticState();
    savedState.profiles.createProfile(Difficulty.Darkest);
    savedState.initialize();

    savedState.save();
    savedState.dispose();

    const loadedState = new AppState();
    loadedState.load();

    expect(savedState.profiles.map).toEqual(loadedState.profiles.map);
  });
});
