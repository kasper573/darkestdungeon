import * as React from "react";
import {Prompt} from "./Popups";
import {observer} from "mobx-react";
import {BannerHeader} from "./BannerHeader";
import {CompareFunction, SortOptions} from "./SortOptions";
import {observable} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {Item} from "../state/types/Item";
import {ItemDropbox} from "./ItemDropbox";

@observer
export class Inventory extends AppStateComponent<{
  filter?: (item: Item) => boolean
}> {
  @observable compareFn: CompareFunction<Item>;

  promptUnequipAll () {
    this.appState.popups.prompt(
      <Prompt query="Unequip all items on all heroes?"/>
    ).then((unequip) => {
      if (unequip) {
        this.activeProfile.unequipAllItems();
      }
    });
  }

  render () {
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
        <ItemDropbox
          items={this.activeProfile.items}
          filter={this.props.filter}
          compare={this.compareFn}
        />
      </div>
    );
  }
}

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: "row"
  }
});
