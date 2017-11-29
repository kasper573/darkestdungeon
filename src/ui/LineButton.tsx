import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {grid} from "../config/Grid";
import {VerticalOutlineBox} from "./VerticalOutlineBox";

@observer
export class LineButton extends React.Component<{
  label?: string,
  classStyle?: any,
  style?: any,
  outlineScale?: number,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}> {
  @observable isHovered = false;

  render () {
    const isHoverEnabled = this.props.onClick !== undefined;
    return (
      <div
        style={this.props.style}
        className={css(styles.lineButton, this.props.classStyle)}
        onMouseEnter={isHoverEnabled ? () => this.isHovered = true : undefined}
        onMouseLeave={isHoverEnabled ? () => this.isHovered = false : undefined}
        onClick={this.props.onClick}>
        {this.props.label}
        {this.props.children}
        {isHoverEnabled && this.isHovered && (
          <VerticalOutlineBox scale={this.props.outlineScale}/>
        )}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  lineButton: {
    paddingTop: grid.gutter,
    paddingBottom: grid.gutter,
    fontWeight: "bold",
    textAlign: "center",

    transition: "text-shadow .1s ease-out",
    textShadow: `0px 0px 0px transparent`,
    ":hover": {
      textShadow: `0px 0px 35px #ffffff`
    }
  }
});
