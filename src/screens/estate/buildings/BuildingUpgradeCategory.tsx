import * as React from "react";
import {observer} from "mobx-react";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {BuildingUpgradeIcon, stepSize} from "./BuildingUpgradeIcon";
import {css, StyleSheet} from "aphrodite";
import {commonStyles, Row} from "../../../config/styles";
import {TooltipArea} from "../../../lib/TooltipArea";
import {Avatar} from "../../../ui/Avatar";

@observer
export class BuildingUpgradeCategory extends React.Component<{
  category: BuildingInfo
}> {
  render () {
    const steps: any[] = [];
    this.props.category.items.forEach((itemInfo, index) => {
      const prerequisite = this.props.category.items[index - 1];
      steps.push(<Line key={"line" + index}/>);
      steps.push(
        <BuildingUpgradeIcon
          key={itemInfo.id}
          item={itemInfo}
          category={this.props.category}
          level={index + 1}
          prerequisite={prerequisite}/>
      );
    });

    return (
      <div className={css(styles.upgrade)}>
        <h1 className={css(commonStyles.upgradeName)}>{this.props.category.name}</h1>
        <Row classStyle={styles.upgradeSequence}>
          <TooltipArea
            tip={this.props.category.description}
            classStyle={styles.upgradeAvatar}>
            <Avatar src={this.props.category.avatarUrl}/>
          </TooltipArea>
          {steps}
        </Row>
      </div>
    );
  }
}

const Line = () => (
  <div className={css(styles.lineContainer)}>
    <div className={css(styles.line)}/>
  </div>
);

const styles = StyleSheet.create({
  upgrade: {
    marginBottom: 3,
    paddingBottom: 3,
    borderBottom: "2px solid gray"
  },

  upgradeAvatar: {
    height: "100%"
  },

  upgradeSequence: {
    height: stepSize * 1.5,
    alignItems: "center"
  },

  lineContainer: {
    justifyContent: "center"
  },

  line: {
    width: stepSize / 2,
    height: 2,
    backgroundColor: "gold"
  }
});
