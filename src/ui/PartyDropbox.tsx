import * as React from "react";
import {StyleSheet} from "aphrodite";
import {Hero} from "../state/ProfileState";
import {Avatar} from "./Avatar";
import {Row} from "../config/styles";

export class PartyDropbox extends React.Component<{
  members: Hero[],
  lock?: boolean
}> {
  render () {
    return (
      <Row classStyle={styles.party}>
        {this.props.members.map((member) => (
          <Avatar key={member.id} src={member.classInfo.avatarUrl}>
            {!this.props.lock && (
              <button onClick={() => member.inParty = false}>Leave</button>
            )}
          </Avatar>
        ))}
      </Row>
    );
  }
}

const styles = StyleSheet.create({
  party: {
    minWidth: 200,
    minHeight: 60,
    position: "absolute",
    bottom: 0,
    left: "33%",
    backgroundColor: "black",
    border: "2px solid gray",
    padding: 4
  }
});
