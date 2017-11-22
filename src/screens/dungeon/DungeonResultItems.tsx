import * as React from "react";
import {BannerHeader} from "../../ui/BannerHeader";
import {Row} from "../../config/styles";
import {ItemIcon} from "../../ui/ItemIcon";
import {CommonHeader} from "../../ui/CommonHeader";
import {Quest} from "../../state/types/Quest";

export class DungeonResultItems extends React.Component<{
  quest: Quest
}> {
  render () {
    return (
      <div>
        <BannerHeader>Quest Rewards</BannerHeader>
        <Row>
          {this.props.quest.rewards.map((item) =>
            <ItemIcon key={item.id} item={item}/>
          )}
        </Row>

        <CommonHeader label="Collected Treasure"/>
        <CommonHeader label="Collected Heirlooms"/>
      </div>
    );
  }
}
