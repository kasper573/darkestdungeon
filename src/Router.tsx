import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";
import {observer} from "mobx-react";
import {TransitionGroup} from "react-transition-group";
import Transition from "react-transition-group/Transition";

const transitionDuration = 500;

@observer
export class Router extends React.Component<{state: AppState}> {
  render () {
    const state = this.props.state;
    const content = React.createElement(state.router.route.component, {
      state,
      path: state.router.path,
      ...state.router.path.args
    });

    return (
      <div className={css(styles.container)}>
        <TransitionGroup className={css(styles.transitionGroup)}>
          {[
            <Screen key={state.router.path.value}>
              {content}
            </Screen>
          ]}
        </TransitionGroup>
      </div>
    );
  }
}

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

const screenStates: {[key: string]: number} = {
  entering: 0,
  entered: 1
};

const styles = StyleSheet.create({
  container: {
    flex: 1
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
