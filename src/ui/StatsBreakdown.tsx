import * as React from "react";
import {StatsInfo} from "../state/types/StatsInfo";
import {StatsValueText} from "./StatsValueText";
import {Column, commonStyles, Row} from "../config/styles";
import {css} from "aphrodite";

export class StatsBreakdown extends React.Component<{
  stats: StatsInfo
}> {
  render () {
    const stats = this.props.stats;
    const modRows = stats.mods.map((mod, index) => {
      let valueText;
      if (mod.percentages !== undefined) {
        valueText = <StatsValueText value={mod.percentages} isPercentage/>;
      } else if (mod.units !== undefined) {
        valueText = <StatsValueText value={mod.units} isPercentage={stats.isPercentage}/>;
      }
      return (
        <Row key={index}>
          {valueText}
          <span style={{flex: "inherit"}}>{mod.source}</span>
        </Row>
      );
    });

    return (
      <div>
        <div className={css(commonStyles.positiveText)}>{stats.longName}</div>
        <Row>
          <Column>Base:</Column>
          <div style={{flex: "inherit"}}>
            <StatsValueText value={stats.value}/>
          </div>
        </Row>
        {modRows}
      </div>
    );
  }
}
