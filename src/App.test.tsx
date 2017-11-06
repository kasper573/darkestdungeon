import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {StyleSheetTestUtils} from "aphrodite";
import {App} from "./App";

describe("App", () => {
  beforeEach(() => StyleSheetTestUtils.suppressStyleInjection());
  afterEach(() => StyleSheetTestUtils.clearBufferAndResumeStyleInjection());

  it("renders without errors", () => {
    TestUtils.renderIntoDocument(<App />);
  });
});
