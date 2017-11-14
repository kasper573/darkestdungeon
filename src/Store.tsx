import * as React from "react";
import {ItemSlot} from "./ItemSlot";
import {CommonHeader} from "./CommonHeader";
import {Item, Profile} from "./ProfileState";
import {observer} from "mobx-react";
import {observable} from "mobx";

@observer
export class Store extends React.Component<{
  initialStoreItems: Item[],
  profile: Profile
}> {
  @observable store: Item[] = this.props.initialStoreItems;
  @observable cart: Item[] = [];

  componentWillUnmount () {
    // Return all items that has not been checked out
    this.cart.slice().forEach(
      (item) => this.returnItem(item)
    );
  }

  buyItem (item: Item) {
    const itemIndex = this.store.indexOf(item);
    this.store.splice(itemIndex, 1);
    this.cart.push(item);
    this.props.profile.gold -= item.info.goldCost;
  }

  returnItem (item: Item) {
    const itemIndex = this.store.indexOf(item);
    this.cart.splice(itemIndex, 1);
    this.store.push(item);
    this.props.profile.gold += item.info.goldCost;
  }

  canAffordItem (item: Item) {
    return this.props.profile.gold >= item.info.goldCost;
  }

  checkout () {
    // Move purchased items to your inventory
    while (this.cart.length > 0) {
      this.props.profile.items.push(this.cart.pop());
    }
  }

  render () {
    return (
      <div>
        <CommonHeader label="Store inventory"/>
        <div>
          {this.store.map((item) =>
            <ItemSlot
              key={item.id}
              item={item.info}
              style={{opacity: this.canAffordItem(item) ? 1 : 0.5}}
              onClick={
                this.canAffordItem(item) ?
                  () => this.buyItem(item) :
                  undefined
              }
            />
          )}
        </div>

        <CommonHeader label="Shopping cart"/>
        <div>
          {this.cart.map((item) =>
            <ItemSlot
              key={item.id}
              item={item.info}
              onClick={() => this.returnItem(item)}
            />
          )}
        </div>
      </div>
    );
  }
}
