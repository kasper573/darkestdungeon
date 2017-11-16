import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Graveyard extends React.Component<{
  header?: string
}> {
  static id = "graveyard";

  render () {
    return (
      <BuildingOverview
        header="Graveyard"
        backgroundUrl={require("../../../../assets/images/graveyard-bg.jpg")}/>
    );
  }
}
