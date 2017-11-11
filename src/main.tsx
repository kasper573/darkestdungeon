import "./reset.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebFontLoader from "webfontloader";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";
import {AppState} from "./AppState";
import {App} from "./App";
import {ambience} from "./config/general";
const {AppContainer} = require("react-hot-loader");
const TWEEN = require("tween.js");

// Initialize application state
const state = new AppState();
state.router.goto("start");
state.ambience.addDefinitions(ambience);
state.initialize();

// Set up basic styling
WebFontLoader.load({google: {families: Object.values(fonts)}});

// Set up TWEEN
requestAnimationFrame(animate);
function animate (time: number) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}

// Set up application rendering
const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: "100%"
  },
  stats: {
    right: 0,
    bottom: 0
  }
});

const rootEl = document.createElement("div");
rootEl.className = css(styles.root);

function render (Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component state={state} setupRoutes/>
    </AppContainer>,
    rootEl
  );
}

render(App);

document.body.appendChild(rootEl);

// Set up HMR
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
