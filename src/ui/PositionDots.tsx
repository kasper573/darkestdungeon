import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {SkillInfo, SkillTargetObject} from "../state/types/SkillInfo";

export class PositionDots extends React.Component<{
  color: string,
  size?: number,
  innerValues?: number[],
  outerValues?: number[],
  classStyle?: any
}> {
  static defaultProps = {
    innerValues: [0, 0, 0, 0],
    outerValues: [0, 0, 0, 0],
    size: 20
  };

  render () {
    return (
      <ul className={css(styles.dots, this.props.classStyle)}>
        {this.props.innerValues.map((innerValue: number, index: number) => (
          <PositionDot
            key={index}
            size={this.props.size}
            color={this.props.color}
            innerValue={innerValue}
            outerValue={this.props.outerValues[index]}
          />
        ))}
      </ul>
    );
  }

  static getPositionValues (skills: SkillInfo[]) {
    return PositionDots.getSpotValues(
      skills.map((skill) => skill.position)
    );
  }

  static getSupportValues (skills: SkillInfo[]) {
    return PositionDots.getSpotValues(
      skills
        .filter((skill) => skill.target.object === SkillTargetObject.Ally)
        .map((skill) => skill.target.spots)
    );
  }

  static getHostileValues (skills: SkillInfo[]) {
    return PositionDots.getSpotValues(
      skills
        .filter((skill) => skill.target.object === SkillTargetObject.Enemy)
        .map((skill) => skill.target.spots)
    );
  }

  private static getSpotValues (spotList: boolean[][]) {
    return spotList.reduce((sum, spots) => {
      spots.forEach((spotActive, index) => {
        sum[index] += spotActive ? 1 : 0;
      });
      return sum;
    }, [0, 0, 0, 0]);
  }
}

class PositionDot extends React.Component<{
  color: string,
  size: number,
  innerValue: number,
  outerValue: number
}> {
  render () {
    const sizeStyle = getSizeStyle(this.props.size);
    const className = css(
      styles.dot,
      this.props.outerValue && styles.dotOuterHighlight
    );

    return (
      <li className={className} style={sizeStyle}>
        <div className={css(styles.dot)} style={{
          backgroundColor: this.props.color,
          transform: `scale(${scales[this.props.innerValue]})`,
          ...sizeStyle
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

function getSizeStyle (size: number) {
  return {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
}

const styles = StyleSheet.create({
  dots: {
    flexDirection: "row"
  },

  dot: {
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
