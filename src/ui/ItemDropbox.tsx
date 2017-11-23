import * as React from "react";
import {ItemIcon, itemSize} from "./ItemIcon";
import {observer} from "mobx-react";
import {DragDropSlot} from "../lib/DragDropSlot";
import {Item} from "../state/types/Item";
import {contains, count, removeItem} from "../lib/Helpers";
import {grid} from "../config/Grid";
import {css, StyleSheet} from "aphrodite";

@observer
export class ItemDropbox extends React.Component<{
  items: Item[],
  extraComponent?: React.SFC<{item: Item}> | React.ComponentClass<{item: Item}>,

  acceptFrom?: Item[],
  filter?: (item: Item) => boolean,
  canInteractWith?: (item: Item) => boolean,
  allowDrop?: (item: Item) => boolean,
  compare?: (a: Item, b: Item) => number,
  slots?: number,

  onItemClick?: (item: Item) => void
  onItemDoubleClick?: (item: Item) => void
}> {
  static defaultProps = {
    filter: () => true,
    allowDrop: () => true,
    canInteractWith: () => true,
    onItemClick: (): null => null,
    onItemDoubleClick: (): null => null
  };

  releaseItem (item: Item, monitor: any) {
    if (monitor.didDrop()) {
      removeItem(this.props.items, item);
    }
  }

  receiveItem (item: Item) {
    this.props.items.push(item);
  }

  allowDrop (item: Item) {
    return this.props.filter(item) &&
      (!this.props.acceptFrom || contains(this.props.acceptFrom, item)) &&
      this.props.allowDrop(item);
  }

  stackItems (items: Item[]) {
    const rest: Item[][] = [];
    const dict = items.reduce((stacks, item) => {
      if (item.info.isStackable) {
        const itemList = stacks.get(item.info.id) || [];
        stacks.set(item.info.id, itemList);
        itemList.push(item);
      } else {
        rest.push([item]);
      }
      return stacks;
    }, new Map<string, Item[]>());

    return Array.from(dict.values()).concat(rest);
  }

  render () {
    let stacks = this.stackItems(
      this.props.items.filter(this.props.filter)
    );

    if (this.props.compare) {
      stacks = stacks.sort((stackA, stackB) => {
        return this.props.compare(stackA[0], stackB[0]);
      });
    }

    // If no free slots are specified we'll add one row
    const freeSlots = this.props.slots !== undefined ?
      Math.max(0, this.props.slots - stacks.length) :
      Math.ceil((stacks.length + 1) / maxItemsInRow) * maxItemsInRow - stacks.length;

    count(freeSlots).forEach(() => stacks.push(null));

    return (
      <div className={css(styles.dropbox)}>
        {stacks.map((stack, index) => {
          const item = stack && stack[0];
          return (
            <DragDropSlot
              key={item ? item.id : ("slot" + index)}
              classStyle={styles.slot}
              type={Item}
              allowDrag={this.props.canInteractWith}
              allowDrop={this.allowDrop.bind(this)}
              onDragEnd={this.releaseItem.bind(this)}
              onDrop={this.receiveItem.bind(this)}
              item={item}>
              <ItemIcon
                item={item}
                onClick={() => item && this.props.canInteractWith(item) && this.props.onItemClick(item)}
                onDoubleClick={() => item && this.props.canInteractWith(item) && this.props.onItemDoubleClick(item)}
                classStyle={item && !this.props.canInteractWith(item) && styles.lockedItem}>
                {stack && stack.length > 1 && (
                  <div className={css(styles.stackSize)}>
                    {stack.length}
                  </div>
                )}
              </ItemIcon>
              {this.props.extraComponent && (
                React.createElement(this.props.extraComponent, {item})
              )}
            </DragDropSlot>
          );
        })}
      </div>
    );
  }
}

const itemMargin = grid.gutter / 2;
const maxItemsInRow = 10;
const styles = StyleSheet.create({
  dropbox: {
    flexWrap: "wrap",
    flexDirection: "row",
    maxWidth: (itemSize.width + (itemMargin * 2)) * maxItemsInRow
  },

  slot: {
    flex: "auto",
    margin: itemMargin,
    ...itemSize
  },

  stackSize: {
    position: "absolute",
    bottom: 0, right: 0,
    background: "blue",
    padding: 2
  },

  lockedItem: {
    opacity: 0.5
  }
});
