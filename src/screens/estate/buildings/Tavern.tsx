import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Tavern extends React.Component<{
  header?: string
}> {
  static id = "tavern";

  render () {
    return (
      <BuildingOverview
        header="Tavern"
        backgroundUrl={require("../../../../assets/images/tavern-bg.jpg")}
      />
    );
  }
}
