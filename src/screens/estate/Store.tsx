import * as React from "react";
import {CommonHeader} from "../../ui/CommonHeader";
import {observer} from "mobx-react";
import {autorun, computed, IReactionDisposer, observable, transaction} from "mobx";
import {Item} from "../../state/types/Item";
import {Profile} from "../../state/types/Profile";
import {moveItem} from "../../lib/Helpers";
import {ItemDropbox} from "../../ui/ItemDropbox";
import {GoldIcon} from "../../ui/GoldIcon";

@observer
export class Store extends React.Component<{
  initialStoreItems: Item[],
  profile: Profile
}> {
  private stopManagingDebt: IReactionDisposer;

  @observable store: Item[] = this.props.initialStoreItems;
  @observable cart: Item[] = [];

  @computed get cartValue () {
    return this.cart.reduce((sum, item) => sum + item.info.value, 0);
  }

  componentWillMount () {
    this.stopManagingDebt = autorun(
      () => this.props.profile.debt = this.cartValue
    );
  }

  componentWillUnmount () {
    // Return all items that has not been checked out
    transaction(() => {
      this.cart.slice().forEach((item) => this.returnItem(item));
    });
    this.stopManagingDebt();
  }

  takeItem (item: Item) {
    moveItem(item, this.store, this.cart);
  }

  returnItem (item: Item) {
    moveItem(item, this.cart, this.store);
  }

  canAffordItem (item: Item) {
    return this.props.profile.goldAfterDebt >= item.info.value;
  }

  purchase () {
    transaction(() => {
      while (this.cart.length) {
        this.props.profile.purchaseItem(
          this.cart.pop(),
          this.props.profile.selectedQuest.items
        );
      }
    });
  }

  render () {
    return (
      <div>
        <CommonHeader label="Store inventory"/>
        <ItemDropbox
          items={this.store}
          acceptFrom={this.cart}
          compare={Item.comparers.name}
          canInteractWith={this.canAffordItem.bind(this)}
          onItemClick={this.takeItem.bind(this)}
          extraComponent={({item}) => item && <GoldIcon amount={item.info.value}/>}
        />

        <CommonHeader label="Shopping cart"/>
        <ItemDropbox
          acceptFrom={this.store}
          items={this.cart}
          onItemClick={this.returnItem.bind(this)}
        />
      </div>
    );
  }
}
