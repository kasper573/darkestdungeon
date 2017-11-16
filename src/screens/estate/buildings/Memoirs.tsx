import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Memoirs extends React.Component<{
  header?: string
}> {
  static id = "memoirs";

  render () {
    return (
      <BuildingOverview
        header="Memoirs"
        backgroundUrl={require("../../../../assets/images/memoirs-bg.jpg")}
      />
    );
  }
}
