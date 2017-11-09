import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {AppState} from "./AppState";
import {App} from "./App";
import {routes} from "./config";
import {PopupState} from "./PopupState";
import {RouterState} from "./RouterState";
import {ProfileState} from "./ProfileState";

describe("Router", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  for (const path in routes) {
    it (`renders "${path}" without errors`, () => {
      const state = new AppState();

      state.isRunningJest = true;
      state.initialize(new RouterState(routes), null, null, new PopupState(), new ProfileState());
      state.router.goto(path);

      TestUtils.renderIntoDocument(<App state={state} />);
      state.dispose();
    });
  }
});
