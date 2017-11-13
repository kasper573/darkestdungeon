import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Guild extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "guild";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Guild"
        backgroundUrl={require("../assets/images/guild-bg.jpg")}
      />
    );
  }
}
