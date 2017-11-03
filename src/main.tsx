import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./App";
const {AppContainer} = require("react-hot-loader");

const rootEl = document.createElement("div");

function render (Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );
}

document.body.appendChild(rootEl);

render(App);

// Update root element with new application on HMR changes
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
