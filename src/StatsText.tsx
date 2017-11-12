import * as React from "react";
import {Column, commonStyles} from "./config/styles";
import {css} from "aphrodite";
import {PopupState} from "./PopupState";
import {StatsInfo} from "./config/general";
import {TooltipArea, TooltipSide} from "./TooltipArea";
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

    let className;
    if (deltaValues[0] > 0) {
      className = css(commonStyles.positiveText);
    } else if (deltaValues[0] < 0) {
      className = css(commonStyles.negativeText);
    }

    return (
      <TooltipArea
        tip={popups && <StatsBreakdown stats={stats}/>}
        side={TooltipSide.Above}
        popups={popups}
        style={{flexDirection: "row"}}
        className={className}
      >
        <Column style={{whiteSpace: "nowrap"}}>{stats.shortName}</Column>
        <Column style={{flex: "inherit"}}>
          <StatsValueText value={modifiedValues} isPercentage={stats.isPercentage}/>
        </Column>
      </TooltipArea>
    );
  }
}
