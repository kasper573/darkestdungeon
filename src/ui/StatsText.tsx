import * as React from "react";
import {Column, commonStyles} from "../config/styles";
import {StatItem} from "../state/types/StatItem";
import {TooltipArea} from "../lib/TooltipArea";
import {StatsBreakdown} from "./StatsBreakdown";

export class StatsTextList extends React.Component<{stats: StatItem[], long?: boolean}> {
  render () {
    return (
      <div>
        {this.props.stats.map((stat) => (
          <StatsText key={stat.info.id} stats={stat} long={this.props.long}/>
        ))}
      </div>
    );
  }
}

export class StatsText extends React.Component<{stats: StatItem, long?: boolean}> {
  render () {
    let classStyle;
    if (this.props.stats.isBasePositive) {
      classStyle = commonStyles.positiveText;
    } else if (this.props.stats.isBaseNegative) {
      classStyle = commonStyles.negativeText;
    }

    return (
      <TooltipArea
        tip={this.props.stats.mods.length > 0 && (
          <StatsBreakdown stats={this.props.stats}/>
        )}
        style={{flexDirection: "row"}}
        classStyle={classStyle}>
        <Column style={{whiteSpace: "nowrap"}}>
          {
            this.props.long ?
              this.props.stats.info.longName :
              this.props.stats.info.shortName
          }
          </Column>
        <Column style={{flex: "inherit"}}>
          {this.props.stats.toString()}
        </Column>
      </TooltipArea>
    );
  }
}
