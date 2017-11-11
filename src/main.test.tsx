import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {AppState} from "./AppState";
import {App} from "./App";
import {ambience, characterNames, itemNames} from "./config/general";
import {routes} from "./config/routes";

describe("Router", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  for (const path in routes) {
    it (`renders "${path}" without errors`, () => {
      const state = new AppState();

      state.isRunningJest = true;
      state.itemGenerator.configure(itemNames);
      state.characterGenerator.configure(characterNames);
      state.router.addRoutes(routes);
      state.ambience.addDefinitions(ambience);
      state.router.goto(path);
      state.initialize();

      TestUtils.renderIntoDocument(<App state={state} />);
      state.dispose();
    });
  }
});
