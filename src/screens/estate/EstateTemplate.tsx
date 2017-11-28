import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {Path, PathTypes} from "../../state/types/Path";
import {PauseMenu} from "../../ui/PauseMenu";
import {EstateRoster} from "./EstateRoster";
import {observer} from "mobx-react";
import {AppStateComponent} from "../../AppStateComponent";
import {InputBindings} from "../../state/InputState";
import {Input} from "../../config/Input";
import {EstateFooter} from "./EstateFooter";
import {ModalState} from "../../state/PopupState";
import {Icon} from "../../ui/Icon";
import {grid} from "../../config/Grid";
import {EstateInventory} from "./EstateInventory";
import {fonts} from "../../../assets/fonts";
import {screenFooterHeight} from "../ScreenFooter";
import {Row} from "../../config/styles";
import {popupOffset} from "../../ui/Popups";

@observer
export class EstateTemplate extends AppStateComponent<{
  background: string,
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

  showInventory () {
    this.appState.popups.show({
      id: "inventory",
      modalState: ModalState.Opaque,
      content: <EstateInventory/>
    });
  }

  render () {
    const isShowingBuilding = this.props.path.parts.length > 1;
    return (
      <div
        className={css(styles.container)}
        style={{backgroundImage: `url(${this.props.background})`}}>

        <InputBindings list={[
          [Input.back, () => this.mayGoBack ? this.goBack() : this.pause()]
        ]}/>

        <div className={css(styles.content, this.appState.showGridOverlay && styles.contentOverlay)}>
          {this.props.children}
        </div>

        <EstateFooter
          continueLabel={this.props.continueLabel}
          inventory={this.props.inventory}
          onInventoryRequested={() => this.showInventory()}
          onContinueRequested={() => this.continueToNextScreen()}
          onPauseRequested={() => this.pause()}
        />

        {this.props.roster && (
          <EstateRoster
            lineupFeatures={this.props.lineupFeaturesInRoster}
            portalNode={isShowingBuilding && this.appState.portalNode}
          />
        )}

        <div className={css(styles.header)}>
          <Row classStyle={styles.headerContent}>
            {this.mayGoBack && (
              <Icon
                classStyle={styles.backButton}
                iconStyle={styles.backButtonIcon}
                src={require("../../../assets/dd/images/shared/progression/progression_back.png")}
                onClick={() => this.goBack()}
              />
            )}
            {this.activeProfile.name} Estate
          </Row>
        </div>
      </div>
    );
  }

  continueToNextScreen () {
    this.props.continueCheck()
      .then((okToContinue) => {
        if (okToContinue === undefined || okToContinue) {
          this.appState.router.goto(this.props.continuePath);
        }
      });
  }
}

export const estateContentPosition = {
  x: grid.paddingLeft + grid.xSpan(1) + grid.gutter - popupOffset,
  y: grid.paddingTop + grid.ySpan(1) + grid.gutter - popupOffset
};

const headerOffset = grid.gutter * 2.5;
const backButtonSize = grid.gutter * 3;
const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: -headerOffset, left: 0,
    paddingTop: headerOffset,
    background: `url(${require("../../../assets/dd/images/campaign/town/estate_title/estate_nameplate.png")})`,
    backgroundSize: "auto 100%",
    backgroundPosition: "0 50%",
    backgroundRepeat: "no-repeat",
    height: grid.ySpan(5),
    width: grid.xSpan(9),
    flexDirection: "row",
    pointerEvents: "none"
  },

  headerContent: {
    height: grid.ySpan(1),
    maxWidth: grid.xSpan(5),
    marginTop: grid.paddingTop,
    marginLeft: grid.paddingLeft + grid.xSpan(2) + grid.gutter,
    alignItems: "center",
    fontSize: grid.fontSize(1),
    fontFamily: fonts.Darkest,
    pointerEvents: "all"
  },

  backButton: {
    position: "absolute",
    left: -(backButtonSize + grid.gutter)
  },

  backButtonIcon: {
    width: backButtonSize,
    height: backButtonSize
  },

  container: {
    flex: 1,
    backgroundSize: "cover",
    backgroundPosition: "50% 50%"
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: grid.paddingTop + grid.ySpan(1) + grid.gutter,
    marginRight: grid.paddingRight + grid.xSpan(3) + grid.gutter,
    marginBottom: grid.paddingBottom + screenFooterHeight,
    marginLeft: grid.paddingLeft + grid.xSpan(1) + grid.gutter
  },

  contentOverlay: {
    backgroundColor: "rgba(200, 200, 50, 0.5)"
  }
});
