import * as React from "react";
import {Hero} from "./ProfileState";
import {Row} from "./config/styles";
import {ItemLevel} from "./ItemLevel";
import {ItemInfo, ItemType} from "./StaticState";
import {ItemSlot} from "./ItemSlot";
import {PopupState} from "./PopupState";

export class HeroEquipment extends React.Component<{
  popups: PopupState,
  hero: Hero
}> {
  render () {
    const popups = this.props.popups;
    return (
      <div>
        <Row>
          <ItemLevel type={ItemType.Armor} level={1}/>
          <ItemLevel type={ItemType.Weapon} level={1}/>
          <div style={{flex: 1}}/>
          <div style={{flex: 1}}/>
        </Row>
        <Row>
          <ItemSlot popups={popups} item={new ItemInfo("Club", ItemType.Weapon)}/>
          <ItemSlot popups={popups} item={new ItemInfo("Robe", ItemType.Armor)}/>
          <ItemSlot popups={popups}/>
          <ItemSlot popups={popups}/>
        </Row>
      </div>
    );
  }
}
