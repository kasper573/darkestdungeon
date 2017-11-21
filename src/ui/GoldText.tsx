import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export class GoldText extends React.Component<{
  amount: number,
  compareWith?: number
}> {
  render () {
    let compareStyle;
    if (this.props.compareWith !== undefined) {
      compareStyle = this.props.amount <= this.props.compareWith ?
        styles.compareEnough :
        styles.compareNotEnough;
    }

    return (
      <span className={css(compareStyle)}>
        {this.props.amount}g
      </span>
    );
  }
}

const styles = StyleSheet.create({
  compareEnough: {
    color: "gold"
  },

  compareNotEnough: {
    color: "red"
  }
});
