import * as React from "react";
import {Popup, PopupProps, Prompt} from "./Popups";
import {Trinket} from "./ProfileState";
import {observer} from "mobx-react";
import {BannerHeader} from "./BannerHeader";
import {CompareFunction, SortOptions} from "./SortOptions";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";

@observer
export class Trinkets extends React.Component<
  PopupProps & {
  state: AppState,
}> {
  @observable compareFn: CompareFunction<Trinket>;

  promptUnequipAll () {
    this.props.state.popups.prompt(
      <Prompt query="Unequip all trinkets on all heroes?"/>
    ).then((unequip) => {
      if (unequip) {
        this.props.state.profiles.activeProfile.unequipAllTrinkets();
      }
    });
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const sortedTrinkets = profile.unassignedTrinkets.sort(this.compareFn);
    return (
      <Popup {...this.props}>
        <BannerHeader>
          Trinket Inventory
        </BannerHeader>
        <div className={css(styles.buttonBar)}>
          <span onClick={() => this.promptUnequipAll()}>
            [UNEQUIP]
          </span>
          <SortOptions
            comparers={Trinket.comparers}
            onChange={(compareFn) => this.compareFn = compareFn}
          />
        </div>
        <ul>
          {sortedTrinkets.map((trinket) => (
            <li key={trinket.id}>
              [{trinket.name}]
            </li>
          ))}
        </ul>
      </Popup>
    );
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: "row"
  }
});
