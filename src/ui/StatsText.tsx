import * as React from "react";
import {Column, commonStyles} from "../config/styles";
import {PopupState} from "../state/PopupState";
import {StatsInfo} from "../state/types/StatsInfo";
import {TooltipArea, TooltipSide} from "../lib/TooltipArea";
import {StatsBreakdown} from "./StatsBreakdown";
import {StatsValueText} from "./StatsValueText";

export class StatsText extends React.Component<{
  popups?: PopupState,
  stats: StatsInfo
}> {
  render () {
    const {stats, popups} = this.props;
    const baseValues = Array.isArray(stats.value) ? stats.value : [stats.value];

    const deltaValues = baseValues.map((baseValue) => {
      return stats.mods.reduce((delta, mod) => {
        if (mod.percentages !== undefined) {
          delta += baseValue * mod.percentages;
        }
        if (mod.units !== undefined) {
          delta += mod.units;
        }
        return delta;
      }, 0);
    });

    const modifiedValues = baseValues.map(
      (value, index) => value + deltaValues[index]
    );

    let classStyle;
    if (deltaValues[0] > 0) {
      classStyle = commonStyles.positiveText;
    } else if (deltaValues[0] < 0) {
      classStyle = commonStyles.negativeText;
    }

    return (
      <TooltipArea
        tip={popups && <StatsBreakdown stats={stats}/>}
        side={TooltipSide.Above}
        style={{flexDirection: "row"}}
        classStyle={classStyle}
      >
        <Column style={{whiteSpace: "nowrap"}}>{stats.shortName}</Column>
        <Column style={{flex: "inherit"}}>
          <StatsValueText value={modifiedValues} isPercentage={stats.isPercentage}/>
        </Column>
      </TooltipArea>
    );
  }
}
