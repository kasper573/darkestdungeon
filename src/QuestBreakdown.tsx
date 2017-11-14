import * as React from "react";
import {Quest} from "./ProfileState";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "./Avatar";
import {Row} from "./config/styles";
import {CommonHeader} from "./CommonHeader";
import {ItemSlot} from "./ItemSlot";
import {PopupState} from "./PopupState";

export class QuestBreakdown extends React.Component<{
  popups: PopupState,
  quest: Quest
}> {
  render () {
    const quest = this.props.quest;
    return (
      <div className={css(styles.container)}>
        <Row className={css(styles.header)}>
          <Avatar src={require("../assets/images/avatar.jpg")}/>
          <div className={css(styles.headerLabel)}>Estate Map</div>
        </Row>
        <CommonHeader label={quest.info.type}/>
        <p>
          {quest.info.description}
        </p>
        <Row>
          <span>Bonfires: {quest.bonfires}</span>
          <span>{quest.mapSize}</span>
          <span>Level {quest.level}</span>
        </Row>

        <CommonHeader label="Objective"/>
        <p>
          {quest.objective.description}
        </p>

        <CommonHeader label="Rewards"/>
        <Row>
          {quest.rewards.map((item) =>
            <ItemSlot
              key={item.id}
              popups={this.props.popups}
              item={item.info}
            />
          )}
        </Row>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40, left: 0, bottom: 40,
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
