import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Guild extends React.Component<{
  header?: string
}> {
  static id = "guild";

  render () {
    return (
      <BuildingOverview
        header="Guild"
        backgroundUrl={require("../../../../assets/images/guild-bg.jpg")}
      />
    );
  }
}
