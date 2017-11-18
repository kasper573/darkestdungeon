import * as React from "react";
import {Row} from "../config/styles";
import {ItemSlot} from "./ItemSlot";
import {Hero} from "../state/types/Hero";
import {observer} from "mobx-react";

@observer
export class HeroEquipment extends React.Component<{
  hero: Hero
}> {
  render () {
    return (
      <Row>
        {this.props.hero.items.map((item) => (
          <ItemSlot key={item.id} item={item}/>
        ))}
      </Row>
    );
  }
}
