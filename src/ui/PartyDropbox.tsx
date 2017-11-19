import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "./Avatar";
import {Row} from "../config/styles";
import {Profile} from "../state/types/Profile";
import {observer} from "mobx-react";
import {DragDropSlot} from "../lib/DragDropSlot";
import {Hero} from "../state/types/Hero";
import {TooltipArea} from "../lib/TooltipArea";
import {HeroBreakdown} from "./HeroBreakdown";

@observer
export class PartyDropbox extends React.Component<{
  profile: Profile,
  lock?: boolean
}> {
  receiveHero (droppedHero: Hero, slotIndex: number) {
    this.props.profile.joinParty(droppedHero, slotIndex);
  }

  render () {
    return (
      <Row classStyle={styles.party}>
        {this.props.profile.partySlots.map((member, slotIndex) => (
          <PartyDropboxSlot
            key={slotIndex}
            member={member}
            lock={this.props.lock}
            onDrop={(droppedHero) => this.receiveHero(droppedHero, slotIndex)}
          />
        ))}
      </Row>
    );
  }
}

class PartyDropboxSlot extends React.Component<{
  member?: Hero,
  lock?: boolean,
  onDrop?: (hero: Hero) => void
}> {

  render () {
    const member = this.props.member;
    return (
      <TooltipArea style={{flex: 1}} tip={member && <HeroBreakdown hero={member}/>}>
        <DragDropSlot
          type={Hero}
          item={member}
          allowDrag={() => !this.props.lock}
          onDrop={this.props.onDrop}>
          <div className={css(styles.slot)}>
            {member && (
              <Avatar
                key={member.id}
                src={member.classInfo.avatarUrl}
              />
            )}
          </div>
        </DragDropSlot>
      </TooltipArea>
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
    background: "black",
    border: "2px solid gray",
    padding: 4
  },

  slot: {
    flex: 1,
    marginRight: 10,
    border: "2px solid gray",
    ":last-child": {
      marginRight: 0
    }
  }
});
