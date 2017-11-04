import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebFontLoader from "webfontloader";
import {App} from "./App";
const {AppContainer} = require("react-hot-loader");

// Set up basic styling
import "./reset.css";
import {fonts} from "../assets/fonts";
WebFontLoader.load({google: {families: Object.values(fonts)}});

// Set up application rendering
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

// Set up HMR
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
