import * as React from "react";
import {ItemInfo} from "../state/types/ItemInfo";
import {Icon} from "./Icon";
import {commonStyles, Row} from "../config/styles";

export class HeirloomIcon extends React.Component<{
  info: ItemInfo,
  amount?: number,
  classStyle?: any
}> {
  render () {
    const tip = this.props.amount !== undefined && (
      <Row classStyle={commonStyles.nowrap}>
        {this.props.info.pluralName}: {this.props.amount} (Used to upgrade town buildings)
      </Row>
    );

    return (
      <Icon
        tip={tip}
        src={this.props.info.iconUrl}
        classStyle={this.props.classStyle}
        side={this.props.amount}
      />
    );
  }
}
