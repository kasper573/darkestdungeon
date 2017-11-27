import * as React from "react";
import {StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonColors, commonStyleFn, Row} from "../config/styles";

export class ScreenFooter extends React.Component<{
  classStyle?: any
}> {
  render () {
    return (
      <Row classStyle={[styles.screenFooter, this.props.classStyle]}>
        <Row classStyle={styles.inner}>
          {this.props.children}
        </Row>
      </Row>
    );
  }
}

const borderSize = grid.border;
const borderSpacing = grid.border * 2;
const styles = StyleSheet.create({
  screenFooter: {
    position: "absolute",
    left: 0, right: 0,
    bottom: grid.paddingBottom - borderSpacing - borderSize,
    height: grid.ySpan(1) + borderSpacing * 2 + borderSize * 2,

    backgroundColor: commonColors.gray,
    boxShadow: commonStyleFn.outerShadow("black", grid.gutter * 2)
  },

  inner: {
    ...commonStyleFn.dockWithPadding(0, borderSize),

    paddingLeft: grid.paddingLeft,
    paddingRight: grid.paddingRight,
    paddingTop: borderSpacing,
    paddingBottom: borderSpacing,

    background: "linear-gradient(to right, rgba(0,0,0,1) 0%,rgba(25,25,25,1) 50%,rgba(0,0,0,1) 100%)",
    boxShadow: commonStyleFn.innerShadow("black", grid.gutter * 3),
    alignItems: "center"
  }
});
