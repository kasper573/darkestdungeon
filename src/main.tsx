import "./reset.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as WebFontLoader from "webfontloader";
import {css, StyleSheet} from "aphrodite";
import {fonts} from "../assets/fonts";
import {AppState} from "./state/AppState";
import {App} from "./App";
import {addStaticState} from "./config/general";
const HTML5Backend = require("react-dnd-html5-backend");
const {DragDropContext} = require("react-dnd");
const HotLoaderContainer = require("react-hot-loader").AppContainer;
const TWEEN = require("tween.js");

// Initialize application state
const state = new AppState();
addStaticState();
state.load();
state.ensureProfile();
state.initialize();
state.router.goto("start");

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

document.body.appendChild(rootEl);

// Set up HMR
if ((module as any).hot) {
  (module as any).hot.accept("./App", () => {
    const NextApp = require<{App: typeof App}>("./App").App;
    render(NextApp);
  });
}
