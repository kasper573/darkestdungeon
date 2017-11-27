import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonStyleFn} from "../config/styles";

export class VerticalOutlineBox extends React.Component<{
  color?: string,
  scale?: number
}> {
  static defaultProps = {
    scale: 1
  };

  render () {
    const barStyle = {
      background: commonStyleFn.shineGradient(this.props.color),
      transform: `scaleY(${this.props.scale})`
    };

    return (
      <div className={css(styles.box)}>
        <div className={css(styles.bar, styles.above)} style={barStyle}/>
        <div className={css(styles.bar, styles.below)} style={barStyle}/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    ...commonStyleFn.dock(),
    pointerEvents: "none"
  },

  bar: {
    height: grid.border,
    borderRadius: grid.border,
    boxShadow: commonStyleFn.boxShadow()
  },

  above: commonStyleFn.dock("top"),
  below: commonStyleFn.dock("bottom")
});
