import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export class LineButton extends React.Component<{
  label: string,
  classStyle?: any,
  onClick?: () => void
}> {
  render () {
    return (
      <span className={css(styles.lineButton, this.props.classStyle)}
            onClick={this.props.onClick}>
        {this.props.label}
      </span>
    );
  }
}

function dynamicStyle (borderColor: string, shadowColor: string, glowSize: number) {
  return {
    borderTop: `2px solid ${borderColor}`,
    borderBottom: `2px solid ${borderColor}`,
    textShadow: `0px 0px ${glowSize}px ${shadowColor}`,
  };
}

const styles = StyleSheet.create({
  lineButton: {
    ...dynamicStyle("transparent", "transparent", 0),
    paddingTop: 4,
    paddingBottom: 4,
    fontWeight: "bold",
    textAlign: "center",
    overflow: "hidden",

    transition: [
      "border .1s ease-out",
      "text-shadow .1s ease-out"
    ].join(","),

    ":hover": {
      ...dynamicStyle("#352813", "#ffffff", 35),
    }
  }
});
