import * as React from "react";
import {commonStyles} from "../config/styles";
import {QuirkInfo} from "../state/types/QuirkInfo";
import {TooltipArea} from "../lib/TooltipArea";
import {StatsTextList} from "./StatsText";

export class QuirkText extends React.Component<{
  quirk: QuirkInfo
}> {
  render () {
    const classStyle = this.props.quirk.stats.isPositive ?
      commonStyles.positiveText :
      commonStyles.negativeText;

    return (
      <TooltipArea
        tip={<StatsTextList stats={this.props.quirk.stats.nonNeutral} long/>}
        classStyle={classStyle}>
        {this.props.quirk.name}
      </TooltipArea>
    );
  }
}
