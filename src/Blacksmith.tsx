import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Blacksmith extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "blacksmith";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Blacksmith"
        backgroundUrl={require("../assets/images/blacksmith-bg.jpg")}
      />
    );
  }
}
