import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class StageCoach extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "coach";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Stage Coach"
        backgroundUrl={require("../assets/images/coach-bg.jpg")}
      />
    );
  }
}
