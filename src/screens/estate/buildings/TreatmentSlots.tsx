import * as React from "react";
import {BuildingInfo} from "../../../state/types/BuildingInfo";
import {count, mapMap} from "../../../lib/Helpers";
import {CommonHeader} from "../../../ui/CommonHeader";
import {Column, Row} from "../../../config/styles";
import {Profile} from "../../../state/types/Profile";
import {StaticState} from "../../../state/StaticState";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";

@observer
export class TreatmentSlots extends React.Component<{
  info: BuildingInfo,
  profile: Profile
}> {
  render () {
    return (
      <div>
        {mapMap(this.props.info.children, (info) => {
          const unlockedSize = this.props.profile.getUpgradeEffects(info.id).size;
          const maximumSize = StaticState.instance.getUpgradeEffects([info.id]).size;
          return (
            <Row key={info.id}>
              <Column>
                <CommonHeader label={info.name}/>
                <p>{info.description}</p>
                <p>{unlockedSize} / {maximumSize}</p>
              </Column>
              <Row>
                {count(maximumSize).map((c, index) => (
                  <TreatmentSlot key={index} isLocked={index >= unlockedSize}/>
                ))}
              </Row>
            </Row>
          );
        })}
      </div>
    );
  }
}

class TreatmentSlot extends React.Component<{isLocked: boolean}> {
  render () {
    return (
      <div className={css(styles.slot, this.props.isLocked && styles.slotLocked)}>
        slot
      </div>
    );
  }
}

const styles = StyleSheet.create({
  slot: {
    border: "2px solid gray",
    marginRight: 5,
    "last-child": {
      marginRight: 0
    }
  },

  slotLocked: {
    background: "red"
  }
});
