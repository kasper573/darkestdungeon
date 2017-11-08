import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {AppState} from "./AppState";
import {App} from "./App";
import {routes} from "./config";
import {PopupState} from "./PopupState";
import {RouterState} from "./RouterState";

describe("Router", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  for (const location in routes) {
    it (`renders "${location}" without errors`, () => {
      const state = new AppState();
      state.initialize(new RouterState(routes), null, null, new PopupState());
      state.router.gotoLocation(location);

      TestUtils.renderIntoDocument(<App state={state} />);
      state.dispose();
    });
  }
});
