import * as React from "react";
import {Heirlooms} from "../../ui/Heirlooms";
import {Row} from "../../config/styles";
import {ScreenFooter} from "../ScreenFooter";
import {StyleSheet} from "aphrodite";
import {HeirloomTrader} from "../../ui/HeirloomTrader";
import {CommonButton, CommonButtonSize} from "../../ui/CommonButton";
import {AppStateComponent} from "../../AppStateComponent";
import {GoldIcon, GoldIconSize} from "../../ui/GoldIcon";
import {grid} from "../../config/Grid";
import {inventoryIcon} from "./EstateInventory";
import {pauseIcon} from "../../ui/PauseMenu";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Icon, IconHighlightType} from "../../ui/Icon";
import {TooltipArea} from "../../lib/TooltipArea";

@observer
export class EstateFooter extends AppStateComponent<{
  continueLabel: string,
  inventory: boolean,
  onInventoryRequested: () => void,
  onContinueRequested: () => void,
  onPauseRequested: () => void
}> {
  @observable private showHeirloomTrader: boolean;
  toggleHeirloomTrader () {
    this.showHeirloomTrader = !this.showHeirloomTrader;
  }

  render () {
    return (
      <ScreenFooter behind={<HeirloomTrader isVisible={this.showHeirloomTrader}/>}>
        <Row valign="center" style={{flex: 1}}>
          <GoldIcon
            size={GoldIconSize.Large}
            amount={this.activeProfile.goldAfterDebt}
            classStyle={styles.gold}
          />
          <Heirlooms counts={this.activeProfile.heirloomCounts} showAll/>
          <TooltipArea tip="Trade heirlooms">
            <Icon
              src={require("../../../assets/dd/images/campaign/town/heirloom_exchange/he_icon_idle.png")}
              classStyle={styles.swapIcon}
              highlight={IconHighlightType.Lines}
              onClick={() => this.toggleHeirloomTrader()}
            />
          </TooltipArea>
        </Row>

        <CommonButton
          size={CommonButtonSize.Medium}
          label={this.props.continueLabel}
          onClick={this.props.onContinueRequested}
        />

        <Row valign="center" align="flex-end" style={{flex: 1}}>
          {this.props.inventory && (
            <Icon
              src={inventoryIcon}
              scale={2}
              highlight={IconHighlightType.Lines}
              onClick={this.props.onInventoryRequested}
              classStyle={styles.iconOnRight}
            />
          )}
          <Icon
            src={pauseIcon}
            scale={2}
            highlight={IconHighlightType.Lines}
            onClick={this.props.onPauseRequested}
            classStyle={styles.iconOnRight}
          />
        </Row>
      </ScreenFooter>
    );
  }
}

const styles = StyleSheet.create({
  swapIcon: {
    width: grid.ySpan(1),
    height: grid.ySpan(1),
    marginLeft: grid.gutter * 3
  },

  iconOnRight: {
    marginLeft: grid.gutter * 6,
    width: grid.ySpan(0.75),
    height: grid.ySpan(0.75)
  },

  gold: {
    marginRight: grid.xSpan(1)
  }
});
