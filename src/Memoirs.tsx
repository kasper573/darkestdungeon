import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Memoirs extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "memoirs";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Memoirs"
        backgroundUrl={require("../assets/images/memoirs-bg.jpg")}
      />
    );
  }
}
