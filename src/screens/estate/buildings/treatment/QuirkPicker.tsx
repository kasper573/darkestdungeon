import * as React from "react";
import {computed} from "mobx";
import {observer} from "mobx-react";
import {QuirkText} from "../../../../ui/QuirkText";
import {Row} from "../../../../config/styles";
import {CommonHeader} from "../../../../ui/CommonHeader";
import {Profile} from "../../../../state/types/Profile";
import {StyleSheet} from "aphrodite";

@observer
export class QuirkPicker extends React.Component<{
  profile: Profile
}> {
  @computed get pendingResident () {
    // Pick the first best non locked resident.
    // NOTE This is safe since we clear all non locked residents upon closing a building.
    return this.props.profile.roster
      .find((hero) => hero.residentInfo && !hero.residentInfo.isLockedIn);
  }

  render () {
    if (!this.pendingResident || !this.pendingResident.residentInfo) {
      return null;
    }

    // Never display the quirk picker for buildings that don't have treatments
    const unlockedEffects = this.props.profile.getUpgradeEffects(this.pendingResident.residentInfo.buildingId);
    if (!unlockedEffects.hasTreatments) {
      return null;
    }

    const quirks = unlockedEffects.treatDisease ?
      this.pendingResident.diseases :
      this.pendingResident.quirks.filter((q) => !q.stats.isPositive);

    return (
      <div>
        <CommonHeader label={`Select ${unlockedEffects.treatmentArea} to treat`}/>
        {quirks.map((q) => {
          const isSelected = q.id === this.pendingResident.residentInfo.treatmentId;
          return (
            <Row
              key={q.id}
              onClick={() => this.pendingResident.residentInfo.treatmentId = q.id}
              classStyle={isSelected && styles.selectedQuirk}>
              <QuirkText quirk={q}/>
              {isSelected && (
                <button onClick={(e) => {
                  e.stopPropagation();
                  this.pendingResident.residentInfo.treatmentId = null;
                }}>
                  X
                </button>
              )}
            </Row>
          );
        })}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  selectedQuirk: {
    backgroundColor: "#ff60a9"
  }
});
