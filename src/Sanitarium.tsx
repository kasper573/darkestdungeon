import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Sanitarium extends React.Component<{
  header?: string
}> {
  static id = "sanitarium";

  render () {
    return (
      <BuildingOverview
        header="Sanitarium"
        backgroundUrl={require("../assets/images/sanitarium-bg.jpg")}
      />
    );
  }
}
