import * as React from "react";
import {ItemIcon, itemSize} from "./ItemIcon";
import {observer} from "mobx-react";
import {DragDropSlot} from "../lib/DragDropSlot";
import {Item} from "../state/types/Item";
import {count, removeItem} from "../lib/Helpers";
import {grid} from "../config/Grid";
import {css, StyleSheet} from "aphrodite";

@observer
export class ItemDropbox extends React.Component<{
  items: Item[],
  filter?: (item: Item) => boolean,
  allowDrop?: (item: Item) => boolean,
  compare?: (a: Item, b: Item) => number,
  slots?: number
}> {
  static defaultProps = {
    filter: () => true,
    allowDrop: () => true
  };

  releaseItem (item: Item) {
    removeItem(this.props.items, item);
  }

  receiveItem (item: Item) {
    this.props.items.push(item);
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
              allowDrop={(draggedItem: Item) => this.props.filter(draggedItem) && this.props.allowDrop(draggedItem)}
              onDragEnd={(draggedItem: Item, monitor: any) => monitor.didDrop() && this.releaseItem(draggedItem)}
              onDrop={(droppedItem: Item) => this.receiveItem(droppedItem)}
              item={item}>
              <ItemIcon item={item}/>
              {stack && stack.length > 1 && (
                <div className={css(styles.stackSize)}>
                  {stack.length}
                </div>
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
  }
});
