
import * as React from "react";
import {Column} from "../config/styles";
import {StatsValue} from "../state/types/StatsInfo";

export class StatsValueText extends React.Component<{
  value: StatsValue,
  isPercentage?: boolean
}> {
  render () {
    const {value, isPercentage} = this.props;
    const values = Array.isArray(value) ? value : [value];
    const valueString = values
      .map((v) => isPercentage ? (v * 100).toFixed(1) + "%" : Math.round(v))
      .join(" - ");

    return <Column>{valueString}</Column>;
  }
}
