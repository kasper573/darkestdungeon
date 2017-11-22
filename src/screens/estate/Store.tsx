import * as React from "react";
import {ItemIcon} from "../../ui/ItemIcon";
import {CommonHeader} from "../../ui/CommonHeader";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Item} from "../../state/types/Item";
import {Profile} from "../../state/types/Profile";
import {moveItem} from "../../lib/Helpers";

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
    moveItem(item, this.store, this.cart);
    this.props.profile.gold -= item.info.value;
  }

  returnItem (item: Item) {
    moveItem(item, this.cart, this.store);
    this.props.profile.gold += item.info.value;
  }

  canAffordItem (item: Item) {
    return this.props.profile.gold >= item.info.value;
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
            <ItemIcon
              key={item.id}
              item={item}
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
            <ItemIcon
              key={item.id}
              item={item}
              onClick={() => this.returnItem(item)}
            />
          )}
        </div>
      </div>
    );
  }
}
