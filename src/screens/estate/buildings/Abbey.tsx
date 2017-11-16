import * as React from "react";
import {BuildingOverview} from "./BuildingOverview";

export class Abbey extends React.Component<{
  header?: string
}> {
  static id = "abbey";

  render () {
    return (
      <BuildingOverview
        header="Abbey"
        backgroundUrl={require("../../../../assets/images/abbey-bg.jpg")}
      />
    );
  }
}
