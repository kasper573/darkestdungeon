import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Blacksmith extends React.Component<{
  header?: string
}> {
  static id = "blacksmith";

  render () {
    return (
      <BuildingOverview
        header="Blacksmith"
        backgroundUrl={require("../../../../assets/images/blacksmith-bg.jpg")}
      />
    );
  }
}
