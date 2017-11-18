import * as React from "react";
import {Prompt} from "./Popups";
import {observer} from "mobx-react";
import {BannerHeader} from "./BannerHeader";
import {CompareFunction, SortOptions} from "./SortOptions";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {Item} from "../state/types/Item";
import {ItemSlot} from "./ItemSlot";

@observer
export class Inventory extends AppStateComponent {
  @observable compareFn: CompareFunction<Item>;

  promptUnequipAll () {
    this.appState.popups.prompt(
      <Prompt query="Unequip all items on all heroes?"/>
    ).then((unequip) => {
      if (unequip) {
        this.appState.profiles.activeProfile.unequipAllItems();
      }
    });
  }

  render () {
    const profile = this.appState.profiles.activeProfile;
    const sortedItems = profile.items.sort(this.compareFn);
    return (
      <div>
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
            <ItemSlot key={item.id} item={item}/>
          ))}
        </ul>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: "row"
  }
});
