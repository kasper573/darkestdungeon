import * as React from "react";
import {AppState} from "./AppState";
import {css, StyleSheet} from "aphrodite";
import {computed} from "mobx";
import {Path, PathTypes} from "./RouterState";

export class EstateTemplate extends React.Component<{
  state: AppState,
  path: Path,
  continueCheck?: () => Promise<any>,
  continueLabel: string,
  continuePath: PathTypes
}> {
  static defaultProps = {
    continueCheck: () => Promise.resolve()
  };

  @computed get mayGoBack () {
    return !this.props.path.equals("estateOverview");
  }

  render () {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.header)}>
          {this.mayGoBack && <span onClick={() => this.onBack()}>[BACK]</span>}
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
          <div className={css(styles.footerRight)}>Right</div>
        </div>
      </div>
    );
  }

  onBack () {
    this.props.state.router.goBack();
  }

  onContinueSelected () {
    this.props.continueCheck()
      .then((okToContinue) => {
        if (okToContinue) {
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
    alignItems: "flex-end"
  }
});
