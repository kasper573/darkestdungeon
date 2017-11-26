import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Path} from "../../state/types/Path";
import {PauseMenu} from "../../ui/PauseMenu";
import {Inventory} from "../../ui/Inventory";
import {EstateRoster} from "./EstateRoster";
import {ModalState} from "../../state/PopupState";
import {observer} from "mobx-react";
import {Popup} from "../../ui/Popups";
import {HeirloomTrader} from "../../ui/HeirloomTrader";
import {commonStyles, Row} from "../../config/styles";
import {AppStateComponent} from "../../AppStateComponent";
import {InputBindings} from "../../state/InputState";
import {Input} from "../../config/Input";
import {PathTypes} from "../../state/types/Path";
import {Heirlooms} from "../../ui/Heirlooms";
import {TooltipArea} from "../../lib/TooltipArea";
import {ItemType} from "../../state/types/ItemInfo";

@observer
export class EstateTemplate extends AppStateComponent<{
  path: Path,
  backPath?: PathTypes,
  continueCheck?: () => Promise<any>,
  continueLabel: string,
  continuePath: PathTypes,
  roster?: boolean,
  inventory?: boolean,
  lineupFeaturesInRoster?: boolean
}> {
  static defaultProps = {
    roster: true,
    inventory: true,
    continueCheck: () => Promise.resolve()
  };

  get mayGoBack () {
    return this.props.backPath;
  }

  pause () {
    this.appState.popups.show(<PauseMenu/>);
  }

  goBack () {
    this.appState.router.goto(this.props.backPath);
  }

  render () {
    const isShowingBuilding = this.props.path.parts.length > 1;
    return (
      <div className={css(styles.container)}>
        <InputBindings list={[
          [Input.back, () => this.mayGoBack ? this.goBack() : this.pause()]
        ]}/>

        <div className={css(styles.header)}>
          {this.mayGoBack && <span onClick={() => this.goBack()}>[BACK]</span>}
          {this.activeProfile.name} Estate
        </div>

        <div className={css(styles.content)}>
          {this.props.children}
        </div>

        <div className={css(styles.footer)}>
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
            <button onClick={() => this.onContinueSelected()}>
              {this.props.continueLabel}
            </button>
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
            <span onClick={() => this.pause()}>
              [PAUSE MENU]
            </span>
          </div>
        </div>

        {this.props.roster && (
          <EstateRoster
            lineupFeatures={this.props.lineupFeaturesInRoster}
            portalNode={isShowingBuilding && this.appState.portalNode}
          />
        )}
      </div>
    );
  }

  onContinueSelected () {
    this.props.continueCheck()
      .then((okToContinue) => {
        if (okToContinue === undefined || okToContinue) {
          this.appState.router.goto(this.props.continuePath);
        }
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30
  },

  header: {
    position: "absolute",
    top: 0, left: 0,
    flexDirection: "row",
    zIndex: 1
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  footer: {
    height: 60,
    flexDirection: "row",
    backgroundColor: "black",
    borderTop: "2px solid #333",
    borderBottom: "2px solid #333",
    padding: 10,
    marginBottom: 20,
    alignItems: "center"
  },

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
