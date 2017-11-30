import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {grid} from "../config/Grid";
import {VerticalOutlineBox} from "./VerticalOutlineBox";
import {commonColors} from "../config/styles";

@observer
export class LineButton extends React.Component<{
  label?: string,
  defaultColor?: string,
  hoverColor?: string,
  outlineScale?: number,
  textGlow?: boolean,
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void,
  classStyle?: any,
  style?: any
}> {
  static defaultProps = {
    defaultColor: "transparent",
    hoverColor: commonColors.gold,
    textGlow: true
  };

  @observable isHovered = false;

  render () {
    const outlineColor = this.isHovered ? this.props.hoverColor : this.props.defaultColor;
    return (
      <div
        style={this.props.style}
        className={css(styles.lineButton, this.props.textGlow && styles.textGlow, this.props.classStyle)}
        onMouseEnter={() => this.isHovered = true}
        onMouseLeave={() => this.isHovered = false}
        onClick={this.props.onClick}>
        {this.props.label}
        {this.props.children}
        <VerticalOutlineBox color={outlineColor} scale={this.props.outlineScale}/>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  lineButton: {
    paddingTop: grid.gutter,
    paddingBottom: grid.gutter,
    fontWeight: "bold",
    textAlign: "center"
  },

  textGlow: {
    transition: "text-shadow .1s ease-out",
    textShadow: `0px 0px 0px transparent`,
    ":hover": {
      textShadow: `0px 0px 35px #ffffff`
    }
  }
});
