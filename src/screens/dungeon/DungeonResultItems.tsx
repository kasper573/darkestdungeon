import * as React from "react";
import {Quest} from "../../state/ProfileState";
import {BannerHeader} from "../../ui/BannerHeader";
import {Row} from "../../config/styles";
import {ItemSlot} from "../../ui/ItemSlot";
import {CommonHeader} from "../../ui/CommonHeader";

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
