import * as React from "react";
import {Prompt} from "./Popups";
import {observer} from "mobx-react";
import {BannerHeader} from "./BannerHeader";
import {CompareFunction, SortOptions} from "./SortOptions";
import {observable, transaction} from "mobx";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {Item} from "../state/types/Item";
import {ItemDropbox} from "./ItemDropbox";
import {Hero} from "../state/types/Hero";
import {grid} from "../config/Grid";
import {Icon} from "./Icon";

@observer
export class Inventory extends AppStateComponent<{
  heroes: Hero[],
  items: Item[],
  filter?: (item: Item) => boolean,
  isEnabled?: boolean,
  onItemRightClick?: (item: Item) => void
}> {
  static defaultProps = {
    isEnabled: true
  };

  @observable compareFn: CompareFunction<Item>;

  async promptUnequipAll () {
    const proceed = await this.appState.popups.prompt(
      <Prompt query="Unequip all items on all heroes?"/>
    );
    if (proceed) {
      this.unequipAllItems();
    }
  }

  unequipAllItems () {
    transaction(() => {
      this.props.heroes.forEach((hero) => {
        while (hero.items.length) {
          this.props.items.push(hero.items.pop());
        }
      });
    });
  }

  render () {
    return (
      <div>
        <BannerHeader>
          Inventory
        </BannerHeader>
        <div className={css(styles.buttonBar)}>
          <Icon
            tip="Unequip items on all heroes"
            size={grid.gutter * 3}
            src={require("../../assets/dd/images/campaign/town/realm_inventory/realm_inventory_unequip_trinkets.png")}
            onClick={() => this.promptUnequipAll()}
          />
          <SortOptions
            comparers={Item.comparers}
            onChange={(compareFn) => this.compareFn = compareFn}
          />
        </div>
        <ItemDropbox
          items={this.props.items}
          filter={this.props.filter}
          compare={this.compareFn}
          canInteractWith={() => this.props.isEnabled}
          onItemRightClick={this.props.onItemRightClick}
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
