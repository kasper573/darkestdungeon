import * as React from "react";
import {StyleSheet} from "aphrodite";
import {commonStyleFn} from "../config/styles";
import {Icon} from "./Icon";
import {grid} from "../config/Grid";

export class Avatar extends React.Component<{
  src: string,
  classStyle?: any,
  onClick?: () => void
}> {
  render () {
    return (
      <Icon
        src={this.props.src}
        iconStyle={[styles.avatar, this.props.classStyle]}
        onClick={this.props.onClick}>
        {this.props.children}
      </Icon>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "black",
    border: commonStyleFn.border(),
    width: grid.ySpan(1),
    height: grid.ySpan(1)
  }
});
