import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {Router} from "./Router";
import {AppState} from "./AppState";

describe("Router", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  it("renders without errors", () => {
    const state = new AppState();
    TestUtils.renderIntoDocument(<Router state={state} />);
  });
});
