import * as React from "react";
import {AppState} from "./AppState";
import {css, StyleSheet} from "aphrodite";
import {Path, PathTypes} from "./RouterState";
import {PauseMenu} from "./PauseMenu";
import {Inventory} from "./Inventory";
import {EstateRoster} from "./EstateRoster";
import {ModalState} from "./PopupState";
import {observer} from "mobx-react";
import {Popup} from "./Popups";
import {HeirloomTrader} from "./HeirloomTrader";
import {Row} from "./config/styles";

@observer
export class EstateTemplate extends React.Component<{
  state: AppState,
  path: Path,
  backPath?: PathTypes,
  continueCheck?: () => Promise<any>,
  continueLabel: string,
  continuePath: PathTypes,
  roster?: boolean,
  partyFeaturesInRoster?: boolean
}> {
  static defaultProps = {
    roster: true,
    continueCheck: () => Promise.resolve()
  };

  get mayGoBack () {
    return this.props.backPath;
  }

  goBack () {
    this.props.state.router.goto(this.props.backPath);
  }

  render () {
    const state = this.props.state;
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>
          {this.mayGoBack && <span onClick={() => this.goBack()}>[BACK]</span>}
          {this.props.state.profiles.activeProfile.name} Estate
        </div>

        <div className={css(styles.content)}>
          {this.props.children}
        </div>

        <div className={css(styles.footer)}>
          <Row className={css(styles.footerLeft)}>
            <span>Gold: {state.profiles.activeProfile.gold}</span>
            <span onClick={() => state.popups.show({
              content: <Popup><HeirloomTrader/></Popup>,
              modalState: ModalState.Opaque,
              group: "heirloomTrader"
            })}>
              [TRADE HEIRLOOMS]
            </span>
          </Row>
          <div className={css(styles.footerCenter)}>
            <button onClick={() => this.onContinueSelected()}>
              {this.props.continueLabel}
            </button>
          </div>
          <div className={css(styles.footerRight)}>
            <span onClick={() => state.popups.show({
              content: <Popup><Inventory state={state}/></Popup>,
              modalState: ModalState.Opaque,
              group: "inventory"
            })}>
              [INVENTORY]
            </span>
            <span onClick={() => state.popups.show(<PauseMenu state={state}/>)}>
              [PAUSE MENU]
            </span>
          </div>
        </div>

        {this.props.roster && (
          <EstateRoster
            state={this.props.state}
            partyFeatures={this.props.partyFeaturesInRoster}
          />
        )}
      </div>
    );
  }

  onContinueSelected () {
    this.props.continueCheck()
      .then((okToContinue) => {
        if (okToContinue === undefined || okToContinue) {
          this.props.state.router.goto(this.props.continuePath);
        }
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
    flex: 1,
  },

  footerCenter: {
    marginLeft: 20,
    marginRight: 20,
  },

  footerRight: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row"
  }
});
