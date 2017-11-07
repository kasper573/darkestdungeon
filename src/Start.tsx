import * as React from "react";
import {TitleHeader} from "./TitleHeader";
import {AppState} from "./AppState";

export class Start extends React.Component<{state: AppState}> {
  render () {
    return (
      <div>
        <TitleHeader/>
      </div>
    );
  }
}
