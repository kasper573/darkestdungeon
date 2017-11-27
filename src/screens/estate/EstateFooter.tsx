import * as React from "react";
import {Heirlooms} from "../../ui/Heirlooms";
import {Row} from "../../config/styles";
import {ScreenFooter} from "../ScreenFooter";
import {StyleSheet} from "aphrodite";
import {Popup} from "../../ui/Popups";
import {HeirloomTrader} from "../../ui/HeirloomTrader";
import {ModalState} from "../../state/PopupState";
import {CommonButton, CommonButtonSize} from "../../ui/CommonButton";
import {AppStateComponent} from "../../AppStateComponent";
import {Icon, IconHighlightType} from "../../ui/Icon";
import {GoldIcon, GoldIconSize} from "../../ui/GoldIcon";
import {grid} from "../../config/Grid";

export class EstateFooter extends AppStateComponent<{
  continueLabel: string,
  inventory: boolean,
  onInventoryRequested: () => void,
  onContinueRequested: () => void,
  onPauseRequested: () => void
}> {
  render () {
    return (
      <ScreenFooter>
        <Row valign="center" style={{flex: 1}}>
          <GoldIcon
            size={GoldIconSize.Large}
            amount={this.activeProfile.goldAfterDebt}
            classStyle={styles.gold}
          />
          <Heirlooms counts={this.activeProfile.heirloomCounts} showAll/>
          <Icon
            src={require("../../../assets/dd/images/campaign/town/heirloom_exchange/he_icon_idle.png")}
            iconStyle={styles.swapIcon}
            tip="Trade heirlooms"
            highlight={IconHighlightType.Lines}
            onClick={() => this.appState.popups.show({
              content: <Popup><HeirloomTrader/></Popup>,
              modalState: ModalState.Opaque,
              id: "heirloomTrader"
            })}
          />
        </Row>

        <CommonButton
          size={CommonButtonSize.Medium}
          label={this.props.continueLabel}
          onClick={this.props.onContinueRequested}
        />

        <Row valign="center" align="flex-end" style={{flex: 1}}>
          {this.props.inventory && (
            <Icon
              src={require("../../../assets/dd/images/campaign/town/realm_inventory/realm_inventory.icon.png")}
              scale={2}
              highlight={IconHighlightType.Lines}
              onClick={this.props.onInventoryRequested}
              classStyle={styles.iconOnRight}
            />
          )}
          <Icon
            src={require("../../../assets/dd/images/panels/icons_equip/trinket/inv_trinket+ancestors_candle.png")}
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
    width: grid.gutter * 6,
    height: grid.gutter * 6,
    marginLeft: grid.gutter * 3
  },

  iconOnRight: {
    marginLeft: grid.gutter * 4
  },

  gold: {
    marginRight: grid.xSpan(1)
  }
});
