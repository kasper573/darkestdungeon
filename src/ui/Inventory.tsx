import * as React from "react";
import {AppStateComponent} from "../AppStateComponent";
import {Item} from "../state/types/Item";
import {ItemDropbox} from "./ItemDropbox";
import {Hero} from "../state/types/Hero";

export class Inventory extends AppStateComponent<{
  heroes: Hero[],
  items: Item[],
  filter?: (item: Item) => boolean,
  compare?: (a: Item, b: Item) => number,
  isEnabled?: boolean,
  onItemRightClick?: (item: Item) => void
}> {
  static defaultProps = {
    isEnabled: true
  };

  render () {
    return (
      <ItemDropbox
        items={this.props.items}
        filter={this.props.filter}
        compare={this.props.compare}
        canInteractWith={() => this.props.isEnabled}
        onItemRightClick={this.props.onItemRightClick}
      />
    );
  }
}
