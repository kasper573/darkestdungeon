import * as React from "react";
import {AppState} from "./AppState";
import {css, StyleSheet} from "aphrodite";
import {Path, PathTypes} from "./RouterState";
import {PauseMenu} from "./PauseMenu";
import {Trinkets} from "./Trinkets";
import {EstateRoster} from "./EstateRoster";
import {ModalState} from "./PopupState";

export class EstateTemplate extends React.Component<{
  state: AppState,
  path: Path,
  backPath?: PathTypes,
  continueCheck?: () => Promise<any>,
  continueLabel: string,
  continuePath: PathTypes
}> {
  static defaultProps = {
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
          <div className={css(styles.footerLeft)}>Left</div>
          <div className={css(styles.footerCenter)}>
            <button onClick={() => this.onContinueSelected()}>
              {this.props.continueLabel}
            </button>
          </div>
          <div className={css(styles.footerRight)}>
            <span onClick={() => state.popups.show({
              content: <Trinkets state={state}/>,
              modalState: ModalState.Opaque
            })}>
              [TRINKETS]
            </span>
            <span onClick={() => state.popups.show(<PauseMenu state={state}/>)}>
              [PAUSE MENU]
            </span>
          </div>
        </div>

        <EstateRoster state={this.props.state}/>
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
    flex: 1
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
