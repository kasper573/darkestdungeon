import * as React from "react";
import {ItemInfo} from "../state/types/ItemInfo";
import {IconWithSide} from "./IconWithSide";
import {grid} from "../config/Grid";
import {TooltipArea} from "../lib/TooltipArea";
import {commonStyles} from "../config/styles";

export class HeirloomIcon extends React.Component<{
  info: ItemInfo,
  amount?: number,
  classStyle?: any
}> {
  render () {
    const amountString = this.props.amount !== undefined && (": " + this.props.amount) + " ";
    return (
      <IconWithSide
        src={this.props.info.iconUrl}
        size={grid.ySpan(0.75)}
        classStyle={this.props.classStyle}
        side={this.props.amount}>
        <TooltipArea
          classStyle={commonStyles.fill}
          tip={`${this.props.info.pluralName}${amountString}(Used to upgrade town buildings)`}
        />
      </IconWithSide>
    );
  }
}
