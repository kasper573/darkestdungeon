import * as React from "react";
import {AppState} from "./AppState";

export class Loading extends React.Component<{state: AppState}> {
  render () {
    return (
      <div>
        Loading
      </div>
    );
  }
}
