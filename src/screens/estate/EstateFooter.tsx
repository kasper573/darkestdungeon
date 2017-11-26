import * as React from "react";
import {TooltipArea} from "../../lib/TooltipArea";
import {Heirlooms} from "../../ui/Heirlooms";
import {commonStyles, Row} from "../../config/styles";
import {ScreenFooter} from "../ScreenFooter";
import {css, StyleSheet} from "aphrodite";
import {Popup} from "../../ui/Popups";
import {HeirloomTrader} from "../../ui/HeirloomTrader";
import {ModalState} from "../../state/PopupState";
import {CommonButton, CommonButtonSize} from "../../ui/CommonButton";
import {Inventory} from "../../ui/Inventory";
import {ItemType} from "../../state/types/ItemInfo";
import {AppStateComponent} from "../../AppStateComponent";

export class EstateFooter extends AppStateComponent<{
  continueLabel: string,
  inventory: boolean,
  onContinueRequested: () => void,
  onPauseRequested: () => void
}> {
  render () {
    return (
      <ScreenFooter>
        <Row classStyle={styles.footerLeft}>
          <span>Gold: {this.activeProfile.goldAfterDebt}</span>
          <Heirlooms counts={this.activeProfile.heirloomCounts} showAll/>
          <TooltipArea
            tip={<span className={css(commonStyles.nowrap)}>Trade heirlooms</span>}
            onClick={() => this.appState.popups.show({
              content: <Popup><HeirloomTrader/></Popup>,
              modalState: ModalState.Opaque,
              id: "heirloomTrader"
            })}
          >
            [⇅]
          </TooltipArea>
        </Row>
        <div className={css(styles.footerCenter)}>
          <CommonButton
            size={CommonButtonSize.Medium}
            label={this.props.continueLabel}
            onClick={this.props.onContinueRequested}
          />
        </div>
        <div className={css(styles.footerRight)}>
          {this.props.inventory && (
            <span onClick={() => this.appState.popups.show({
              id: "inventory",
              modalState: ModalState.Opaque,
              content: (
                <Popup>
                  <Inventory
                    heroes={this.activeProfile.roster}
                    items={this.activeProfile.items}
                    filter={(i) => i.info.type !== ItemType.Heirloom}
                  />
                </Popup>
              )
            })}>
              [INVENTORY]
            </span>
          )}
          <span onClick={this.props.onPauseRequested}>
            [PAUSE MENU]
          </span>
        </div>
      </ScreenFooter>
    );
  }
}

const styles = StyleSheet.create({
  footerLeft: {
    flex: 1
  },

  footerCenter: {
    marginLeft: 20,
    marginRight: 20
  },

  footerRight: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row"
  }
});
