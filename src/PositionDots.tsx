import * as React from "react";
import {css, StyleSheet} from "aphrodite";

export class PositionDots extends React.Component<{
  color: string,
  innerValues?: [number, number, number, number],
  outerValues?: [number, number, number, number]
}> {
  static defaultProps = {
    innerValues: [0, 0, 0, 0],
    outerValues: [0, 0, 0, 0]
  };

  render () {
    return (
      <ul className={css(styles.dots)}>
        {this.props.innerValues.map((innerValue: number, index: number) => (
          <PositionDot
            key={index}
            color={this.props.color}
            innerValue={innerValue}
            outerValue={this.props.outerValues[index]}
          />
        ))}
      </ul>
    );
  }
}

class PositionDot extends React.Component<{
  color: string,
  innerValue: number,
  outerValue: number
}> {
  render () {
    const className = css(
      styles.dot,
      this.props.outerValue && styles.dotOuterHighlight
    );

    return (
      <li className={className}>
        <div className={css(styles.dot)} style={{
          backgroundColor: this.props.color,
          transform: `scale(${scales[this.props.innerValue]})`
        }}/>
      </li>
    );
  }
}

const scales = [
  0,
  0.25,
  0.4,
  0.66
];

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row"
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    background: "gray",
    boxShadow: "0px 0px 5px black",

    marginRight: 5,
    ":last-child": {
      marginRight: 0
    }
  },

  dotOuterHighlight: {
    boxShadow: "0px 0px 5px #8afb8a"
  }
});
