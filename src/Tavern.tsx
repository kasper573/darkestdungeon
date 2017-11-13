import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Tavern extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "tavern";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Tavern"
        backgroundUrl={require("../assets/images/tavern-bg.jpg")}
      />
    );
  }
}
