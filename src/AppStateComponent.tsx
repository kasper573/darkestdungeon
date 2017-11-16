import * as React from "react";
import * as PropTypes from "prop-types";
import {AppState} from "./state/AppState";

export const appStateContext = {
  state: PropTypes.instanceOf(AppState)
};

export abstract class AppStateComponent<P = {}> extends React.Component<P> {
  context: {state: AppState};
  static contextTypes = appStateContext;

  get appState () {
    return this.context.state;
  }
}
