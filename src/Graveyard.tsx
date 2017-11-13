import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Graveyard extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "graveyard";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Graveyard"
        backgroundUrl={require("../assets/images/graveyard-bg.jpg")}/>
    );
  }
}
