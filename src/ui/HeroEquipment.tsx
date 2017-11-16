import * as React from "react";
import {Hero} from "../state/ProfileState";
import {Row} from "../config/styles";
import {ItemLevel} from "./ItemLevel";
import {ItemInfo, ItemType} from "../state/StaticState";
import {ItemSlot} from "./ItemSlot";

export class HeroEquipment extends React.Component<{
  hero: Hero
}> {
  render () {
    return (
      <div>
        <Row>
          <ItemLevel type={ItemType.Armor} level={1}/>
          <ItemLevel type={ItemType.Weapon} level={1}/>
          <div style={{flex: 1}}/>
          <div style={{flex: 1}}/>
        </Row>
        <Row>
          <ItemSlot item={new ItemInfo("Club", ItemType.Weapon)}/>
          <ItemSlot item={new ItemInfo("Robe", ItemType.Armor)}/>
          <ItemSlot />
          <ItemSlot />
        </Row>
      </div>
    );
  }
}
