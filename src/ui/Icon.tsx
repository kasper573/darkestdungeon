import * as React from "react";
import {TooltipArea} from "../lib/TooltipArea";
import {css, StyleSheet} from "aphrodite";
import {grid} from "../config/Grid";
import {commonStyles, Row} from "../config/styles";
import {LineButton} from "./LineButton";

export class Icon extends React.Component<{
  tip?: any,
  src?: string,
  iconStyle?: any,
  scale?: number,
  classStyle?: any,
  onClick?: () => void
}> {
  static defaultProps = {
    scale: 1
  };

  render () {
    const hasExtra = this.props.children !== undefined;
    const dynamicIconStyle = {
      backgroundImage: this.props.src ? `url(${this.props.src})` : undefined,
      transform: `scale(${this.props.scale})`,
      transformOrigin: "50% 100%",
      marginRight: hasExtra ? (this.props.scale - 1) * grid.gutter * 4 : undefined
    };

    return (
      <TooltipArea
        tip={this.props.tip}
        classStyle={[commonStyles.commonName, this.props.classStyle]}>
        <Row classStyle={styles.icon}>
          <LineButton
            outlineScale={1 / this.props.scale}
            onClick={this.props.onClick}
            classStyle={[styles.image, this.props.iconStyle]}
            style={dynamicIconStyle}
          />
          {hasExtra && (
            <div className={css(styles.extra)}>
              {this.props.children}
            </div>
          )}
        </Row>
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    alignItems: "center"
  },

  image: {
    backgroundSize: "contain",
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat",
    width: grid.gutter * 4,
    height: grid.gutter * 4
  },

  extra: {
    marginLeft: grid.gutter / 2,
    justifyContent: "center"
  }
});
