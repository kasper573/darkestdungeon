import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {TooltipArea} from "../lib/TooltipArea";
import {SkillBreakdown} from "./SkillBreakdown";
import {Skill} from "../state/types/Skill";
import {observer} from "mobx-react";

@observer
export class SkillIcon extends React.Component<{
  skill: Skill,
  isEnabled?: boolean,
  isSelected?: boolean,
  onClick?: () => void
}> {
  static defaultProps = {
    isEnabled: true
  };

  render () {
    const lockSymbol = this.props.skill.level === 0 && (
      <span>L</span>
    );

    const isSelected = this.props.isSelected !== undefined ?
      this.props.isSelected :
      this.props.skill.isSelected;

    const selectionIndicator = isSelected && (
      <div className={css(styles.selectionIndicator)}/>
    );

    const disabledIndicator = !this.props.isEnabled && (
      <div className={css(styles.disabledIndicator)}/>
    );

    const levelIndicator = (
      <span className={css(styles.levelIndicator)}>
        {this.props.skill.level}
      </span>
    );

    return (
      <TooltipArea
        onClick={this.props.isEnabled ? this.props.onClick : undefined}
        tip={<SkillBreakdown skill={this.props.skill}/>}
        classStyle={styles.container}>
        {lockSymbol}
        {levelIndicator}
        {selectionIndicator}
        {disabledIndicator}
      </TooltipArea>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    background: "rgb(0, 0, 60)",
    opacity: 0.8,
    minWidth: 30,
    minHeight: 30,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 2,
    ":last-child": {
      marginRight: 0
    },

    ":hover": {
      opacity: 1
    }
  },

  selectionIndicator: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    border: "2px solid gold",
    boxShadow: "inset 0 0 10px #000000"
  },

  levelIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "black",
    color: "white",
    padding: 2
  },

  disabledIndicator: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    background: "rgba(0, 0, 0, 0.5)"
  }
});
