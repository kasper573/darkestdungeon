import "./reset.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebFontLoader from "webfontloader";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "src/assets/fonts";
import {AppState} from "./state/AppState";
import {App} from "./App";
import {addStaticState} from "./config/general";
import {StaticState} from "./state/StaticState";
import {barks} from "./config/barks";
const HTML5Backend = require("react-dnd-html5-backend");
const {DragDropContext} = require("react-dnd");
const HotLoaderContainer = require("react-hot-loader").AppContainer;
const TWEEN = require("tween.js");
const queryString = require("query-string");

// Initialize application state
const state = new AppState();
state.barker.barks = barks;
addStaticState();
state.load();

let startPath = "start";

// Developer features:
// - Automates default profile if none exist
// - Expose application state in global scope
// - Allow custom start path
if (process.env.NODE_ENV !== "production") {
  state.ensureProfile();
  (global as any).appState = state;
  (global as any).staticState = StaticState.instance;
  if (typeof window !== "undefined") {
    const customStartPath = queryString.parse(window.location.search).path;
    if (customStartPath) {
      startPath = customStartPath;
    }
  }
}

state.initialize();
state.router.goto(startPath);

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
  }
});

let rootEl = document.querySelector("#root");
if (!rootEl) {
  rootEl = document.createElement("div");
  rootEl.id = "root";
  document.body.appendChild(rootEl);
}

rootEl.className = css(styles.root);

@DragDropContext(HTML5Backend)
class AppContainer extends React.Component {
  render () {
    return (
      <HotLoaderContainer>
        {this.props.children}
      </HotLoaderContainer>
    );
  }
}

function render (Component: any) {
  ReactDOM.render(
    <AppContainer>
      <Component state={state} setupRoutes/>
    </AppContainer>,
    rootEl
  );
}

render(App);

// Set up HMR
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
