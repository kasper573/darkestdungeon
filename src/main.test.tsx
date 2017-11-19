import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {AppState} from "./state/AppState";
import {App} from "./app";
import {addStaticState} from "./config/general";
import {routes} from "./config/routes";
import {StaticState} from "./state/StaticState";
import {Difficulty} from "./state/types/Profile";

describe("main", () => {
  beforeEach(() => {
    addStaticState();
    StyleSheetTestUtils.suppressStyleInjection();
  });

  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
    localStorage.clear();
    StaticState.instance.clear();
  });

  for (const path in routes) {
    it (`renders "${path}" without errors`, () => {
      const state = new AppState();
      state.ensureProfile();
      state.isRunningJest = true;
      state.router.addRoutes(routes);
      state.router.goto(path);
      state.initialize();

      TestUtils.renderIntoDocument(<App state={state} />);
      state.dispose();
    });
  }

  it (`hibernates state`, () => {
    const savedState = new AppState();
    savedState.profiles.createProfile(Difficulty.Darkest);

    savedState.save();

    const loadedState = new AppState();
    loadedState.load();

    expect(savedState.profiles.map).toEqual(loadedState.profiles.map);
  });
});
