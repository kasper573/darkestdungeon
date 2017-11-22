import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "./Avatar";
import {Row} from "../config/styles";
import {CommonHeader} from "./CommonHeader";
import {ItemIcon} from "./ItemIcon";
import {Quest} from "../state/types/Quest";

export class QuestBreakdown extends React.Component<{
  quest: Quest
}> {
  render () {
    const quest = this.props.quest;
    return (
      <div className={css(styles.container)}>
        <Row classStyle={styles.header}>
          <Avatar src={require("../../assets/images/avatar.jpg")}/>
          <div className={css(styles.headerLabel)}>Estate Map</div>
        </Row>
        <CommonHeader label={quest.info.type}/>
        <p>
          {quest.info.description}
        </p>
        <Row>
          <span>Bonfires: {quest.bonfires}</span>
          <span>{quest.map.size}</span>
          <span>Level {quest.level}</span>
        </Row>

        <CommonHeader label="Objective"/>
        <p>
          {quest.objective.description}
        </p>

        <CommonHeader label="Rewards"/>
        <Row>
          {quest.rewards.map((item) =>
            <ItemIcon key={item.id} item={item}/>
          )}
        </Row>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, left: 0, bottom: 40,
    background: "black",
    color: "white",
    padding: 10
  },

  header: {
    marginBottom: 10
  },

  headerLabel: {
    fontSize: "1.2em",
    margin: 10
  }
});
