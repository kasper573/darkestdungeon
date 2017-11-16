import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {AppState} from "./state/AppState";
import {App} from "./app";
import {addStaticState} from "./config/general";
import {routes} from "./config/routes";

describe("Router", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  for (const path in routes) {
    it (`renders "${path}" without errors`, () => {
      const state = new AppState();
      addStaticState();
      state.isRunningJest = true;
      state.router.addRoutes(routes);
      state.router.goto(path);
      state.profiles.activeProfile.heroes[0].inParty = true;
      state.initialize();

      TestUtils.renderIntoDocument(<App state={state} />);
      state.dispose();
    });
  }
});
