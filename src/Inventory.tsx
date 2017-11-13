import * as React from "react";
import {Popup, PopupProps, Prompt} from "./Popups";
import {Item} from "./ProfileState";
import {observer} from "mobx-react";
import {BannerHeader} from "./BannerHeader";
import {CompareFunction, SortOptions} from "./SortOptions";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {AppState} from "./AppState";

@observer
export class Inventory extends React.Component<
  PopupProps & {
  state: AppState,
}> {
  @observable compareFn: CompareFunction<Item>;

  promptUnequipAll () {
    this.props.state.popups.prompt(
      <Prompt query="Unequip all items on all heroes?"/>
    ).then((unequip) => {
      if (unequip) {
        this.props.state.profiles.activeProfile.unequipAllItems();
      }
    });
  }

  render () {
    const profile = this.props.state.profiles.activeProfile;
    const sortedItems = profile.unassignedItems.sort(this.compareFn);
    return (
      <Popup {...this.props}>
        <BannerHeader>
          Inventory
        </BannerHeader>
        <div className={css(styles.buttonBar)}>
          <span onClick={() => this.promptUnequipAll()}>
            [UNEQUIP]
          </span>
          <SortOptions
            comparers={Item.comparers}
            onChange={(compareFn) => this.compareFn = compareFn}
          />
        </div>
        <ul>
          {sortedItems.map((item) => (
            <li key={item.id}>
              [{item.itemInfo.name}]
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
