import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebFontLoader from "webfontloader";
import {css, StyleSheet} from "aphrodite";
import {App} from "./App";
const TWEEN = require("tween.js");
const {AppContainer} = require("react-hot-loader");
const Stats = require("stats.js");

// Set up basic styling
import "./reset.css";
import {fonts} from "../assets/fonts";
WebFontLoader.load({google: {families: Object.values(fonts)}});

// Set up TWEEN
const stats = new Stats();
requestAnimationFrame(animate);
function animate (time: number) {
  stats.begin();
  TWEEN.update(time);
  stats.end();
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

// Set up stats.js panel in the lower right
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats.dom.className = css(styles.stats);
stats.dom.style.top = "";
stats.dom.style.left = "";

function render (Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );
}

document.body.appendChild(rootEl);
document.body.appendChild(stats.dom);

render(App);

// Set up HMR
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
