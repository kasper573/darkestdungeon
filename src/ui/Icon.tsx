import * as React from "react";
import {TooltipArea} from "../lib/TooltipArea";
import {css, StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonStyles, Row} from "../config/styles";
import {LineButton} from "./LineButton";
import {observable} from "mobx";
import {observer} from "mobx-react";

export enum IconHighlightType {
  Lines,
  Opacity
}

@observer
export class Icon extends React.Component<{
  tip?: any,
  src?: string,
  side?: any,

  size?: number,
  width?: number,
  height?: number,
  scale?: number,

  highlight?: IconHighlightType,

  iconStyle?: any,
  classStyle?: any,
  onClick?: () => void
}> {
  static defaultProps = {
    scale: 1,
    highlight: IconHighlightType.Opacity
  };

  @observable isHovered = false;

  render () {
    const hasSide = this.props.side !== undefined;
    const customSize = this.props.size !== undefined ? this.props.size : undefined;
    const customWidth = this.props.width !== undefined ? this.props.width : customSize;
    const customHeight = this.props.height !== undefined ? this.props.height : customSize;

    const dynamicIconStyle = {
      backgroundImage: this.props.src ? `url(${this.props.src})` : undefined,
      transform: `scale(${this.props.scale})`,
      transformOrigin: "50% 100%",
      marginRight: hasSide ? (this.props.scale - 1) * grid.gutter * 4 : undefined,
      width: customWidth,
      height: customHeight
    };

    let iconElement;
    switch (this.props.highlight) {
      case IconHighlightType.Lines:
        iconElement = (
          <LineButton
            outlineScale={1 / this.props.scale}
            onClick={this.props.onClick}
            classStyle={[styles.icon, this.props.iconStyle]}
            style={dynamicIconStyle}>
            {this.props.children}
          </LineButton>
        );
        break;
      case IconHighlightType.Opacity:
        if (this.props.onClick && !this.isHovered) {
          (dynamicIconStyle as any).opacity = 0.6;
        }

        iconElement = (
          <div
            onMouseEnter={() => this.isHovered = true}
            onMouseLeave={() => this.isHovered = false}
            onClick={this.props.onClick}
            className={css([styles.icon, this.props.iconStyle])}
            style={dynamicIconStyle}>
            {this.props.children}
          </div>
        );
        break;
    }

    return (
      <TooltipArea
        tip={this.props.tip}
        classStyle={[commonStyles.commonName, this.props.classStyle]}>
        <Row classStyle={styles.container}>
          {iconElement}
          {hasSide && (
            <div className={css(styles.side)}>
              {this.props.side}
            </div>
          )}
        </Row>
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },

  icon: {
    backgroundSize: "contain",
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    width: grid.gutter * 4,
    height: grid.gutter * 4
  },

  side: {
    marginLeft: grid.gutter / 2,
    justifyContent: "center"
  }
});
