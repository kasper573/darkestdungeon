import * as React from "react";
import {commonStyles, Row} from "../../../config/styles";
import {css} from "aphrodite";

export class UpgradeTooltip extends React.Component<{
  cost: any,
  isAvailable: boolean,
  prerequisiteName: string,
  prerequisiteLevel: number
}> {
  render () {
    return (
      <div>
        <Row style={{whiteSpace: "nowrap"}}>
          <span>Cost: </span>
          {this.props.cost}
        </Row>
        {this.props.children}
        {!this.props.isAvailable && (
          <div style={{whiteSpace: "nowrap"}}>
            <div className={css(commonStyles.commonName)}>Prerequisites:</div>
            <span style={{color: "red"}}>
              {this.props.prerequisiteName} Level {this.props.prerequisiteLevel}
            </span>
          </div>
        )}
      </div>
    );
  }
}
