import * as React from "react";
import {Quest} from "./ProfileState";
import {BannerHeader} from "./BannerHeader";
import {Row} from "./config/styles";
import {ItemSlot} from "./ItemSlot";
import {CommonHeader} from "./CommonHeader";

export class DungeonResultItems extends React.Component<{
  quest: Quest
}> {
  render () {
    return (
      <div>
        <BannerHeader>Quest Rewards</BannerHeader>
        <Row>
          {this.props.quest.rewards.map((item) =>
            <ItemSlot
              key={item.id}
              item={item.info}
            />
          )}
        </Row>

        <CommonHeader label="Collected Treasure"/>
        <CommonHeader label="Collected Heirlooms"/>
      </div>
    );
  }
}
