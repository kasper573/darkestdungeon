import * as React from "react";
import {commonStyles} from "./config/styles";
import {css} from "aphrodite";
import {QuirkInfo, todo} from "./config/general";
import {TooltipArea} from "./TooltipArea";
import {PopupState} from "./PopupState";

export class QuirkText extends React.Component<{
  popups: PopupState,
  quirk: QuirkInfo
}> {
  render () {
    const className = css(
      this.props.quirk.isPositive ?
        commonStyles.positiveText :
        commonStyles.negativeText
    );

    return (
      <TooltipArea tip={todo} popups={this.props.popups} className={className}>
        {this.props.quirk.name}
      </TooltipArea>
    );
  }
}
