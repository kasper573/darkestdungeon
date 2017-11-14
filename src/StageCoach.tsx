import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class StageCoach extends React.Component<{
  header?: string
}> {
  static id = "coach";

  render () {
    return (
      <BuildingOverview
        header="Stage Coach"
        backgroundUrl={require("../assets/images/coach-bg.jpg")}
      />
    );
  }
}
