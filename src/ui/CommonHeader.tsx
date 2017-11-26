import * as React from "react";
import {css} from "aphrodite";
import {commonStyles} from "../config/styles";

export class CommonHeader extends React.Component<{label: string}> {
  render () {
    return (
      <div className={css(commonStyles.commonName, commonStyles.nowrap)}>
        {this.props.label}
      </div>
    );
  }
}
