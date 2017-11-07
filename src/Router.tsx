import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {observer} from "mobx-react";
import {DevTools} from "./DevTools";

// NOTE I'm not sure about this structure
import {ambienceDefinitions, routes} from "./config";
import {AmbienceState} from "./AmbienceState";
import {RouterState} from "./RouterState";
import {MusicState} from "./MusicState";
import {TransitionGroup} from "react-transition-group";
import Transition from "react-transition-group/Transition";

const transitionDuration = 500;

@observer
export class Router extends React.Component<{state: AppState}> {
  componentWillMount () {
    // HACK This will make testing problematic
    this.props.state.initialize(
      new RouterState(routes, "start"),
      new AmbienceState(ambienceDefinitions),
      new MusicState()
    );
  }

  render () {
    const state = this.props.state;
    const content = React.createElement(state.router.component, {state});

    return (
      <div className={css(styles.base)}>
        <TransitionGroup className={css(styles.transitionGroup)}>
          {[
            <Screen key={state.router.location}>
              {content}
            </Screen>
          ]}
        </TransitionGroup>
        <DevTools router={state.router}/>
      </div>
    );
  }
}

const screenStates: {[key: string]: number} = {
  entering: 0,
  entered: 1
};

const Screen = ({children, ...props}: any) => (
  <Transition {...props} timeout={transitionDuration}>
    {(state: string) => (
      <div className={css(styles.screen)}
           style={{opacity: screenStates[state] || 0}}>
        {children}
      </div>
    )}
  </Transition>
);

const styles = StyleSheet.create({
  base: {
    fontFamily: "Ubuntu",
    width: "100%",
    height: "100%",
    background: "black",
    color: "white",
    overflow: "hidden"
  },

  transitionGroup: {
    flex: 1,
    position: "relative",
  },

  screen: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    transition: `opacity ${transitionDuration}ms ease-in-out`
  }
});
