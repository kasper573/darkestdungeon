import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";
import {PopupState} from "./PopupState";

export class Abbey extends React.Component<{
  popups: PopupState,
  header?: string
}> {
  static id = "abbey";

  render () {
    return (
      <BuildingOverview
        popups={this.props.popups}
        header="Abbey"
        backgroundUrl={require("../assets/images/abbey-bg.jpg")}
      />
    );
  }
}
