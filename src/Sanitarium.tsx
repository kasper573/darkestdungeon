import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Sanitarium extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "sanitarium";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Sanitarium"
        backgroundUrl={require("../assets/images/sanitarium-bg.jpg")}
      />
    );
  }
}
