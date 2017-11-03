import * as React from "react";
import * as TestUtils from "react-dom/test-utils";
import {App} from "./App";

describe("App", () => {
  it("renders without errors", () => {
    TestUtils.renderIntoDocument(<App />);
  });
});
