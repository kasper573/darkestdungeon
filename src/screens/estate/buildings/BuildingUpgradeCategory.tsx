import * as React from "react";
import {observer} from "mobx-react";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {BuildingUpgradeIcon, stepSize} from "./BuildingUpgradeIcon";
import {css, StyleSheet} from "aphrodite";
import {commonStyleFn, commonStyles, Row} from "../../../config/styles";
import {Icon} from "../../../ui/Icon";
import {grid} from "../../../config/Grid";

@observer
export class BuildingUpgradeCategory extends React.Component<{
  category: BuildingInfo
}> {
  render () {
    const steps: any[] = [];
    this.props.category.items.forEach((itemInfo, index) => {
      const prerequisite = this.props.category.items[index - 1];
      steps.push(<Dash key={"line" + index}/>);
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
      <div className={css(styles.container)}>
        <h1 className={css(commonStyles.commonName)}>
          {this.props.category.name}
        </h1>
        <Row classStyle={styles.sequence}>
          <Icon
            size={stepSize * 1.5}
            tip={this.props.category.description}
            src={this.props.category.avatarUrl}
          />
          {steps}
        </Row>
      </div>
    );
  }
}

const Dash = () => <div className={css(styles.dash)}/>;

const styles = StyleSheet.create({
  container: {
    marginBottom: 3,
    paddingBottom: 3
  },

  sequence: {
    marginTop: grid.gutter,
    height: stepSize * 1.5,
    alignItems: "center"
  },

  dash: {
    justifyContent: "center",

    ":after": {
      content: "' '",
      width: stepSize / 2,
      height: grid.border,
      background: commonStyleFn.shineGradient()
    }
  }
});
