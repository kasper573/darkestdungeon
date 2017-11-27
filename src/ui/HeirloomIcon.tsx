import * as React from "react";
import {ItemInfo} from "../state/types/ItemInfo";
import {Icon} from "./Icon";

export class HeirloomIcon extends React.Component<{
  info: ItemInfo,
  amount?: number,
  classStyle?: any
}> {
  render () {
    const amountString = this.props.amount !== undefined && (": " + this.props.amount) + " ";
    return (
      <Icon
        tip={`${this.props.info.pluralName}${amountString}(Used to upgrade town buildings)`}
        src={this.props.info.iconUrl}
        classStyle={this.props.classStyle}
        side={this.props.amount}
      />
    );
  }
}
