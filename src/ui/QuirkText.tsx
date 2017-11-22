import * as React from "react";
import {commonStyles, Row} from "../config/styles";
import {QuirkInfo} from "../state/types/QuirkInfo";
import {TooltipArea} from "../lib/TooltipArea";
import {StatsTextList} from "./StatsText";
import {StaticState} from "../state/StaticState";

export class QuirkText extends React.Component<{
  quirk: QuirkInfo
}> {
  render () {
    const classStyle = this.props.quirk.stats.isPositive ?
      commonStyles.positiveText :
      commonStyles.negativeText;

    const banned = this.props.quirk.bannedTreatmentIds.map((buildingId) =>
      StaticState.instance.buildingInfoRoot.get(buildingId)
    ).map((info) => info.name);

    const forces = this.props.quirk.forcedTreatmentIds.map((buildingId) =>
      StaticState.instance.buildingInfoRoot.get(buildingId)
    ).map((info) => info.name);

    return (
      <TooltipArea
        tip={(
          <div>
            <StatsTextList stats={this.props.quirk.stats.nonNeutral} long/>
            {banned.length > 0 && (
              <Row>Can't receive treatment from {banned.join(", ")}</Row>
            )}
            {forces.length > 0 && (
              <Row>Only accepts treatment from {forces.join(", ")}</Row>
            )}
          </div>
        )}
        classStyle={classStyle}>
        {this.props.quirk.name}
      </TooltipArea>
    );
  }
}
