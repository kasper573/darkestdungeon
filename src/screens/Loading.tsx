import * as React from "react";
import {observable} from "mobx";
import {Path} from "../state/types/Path";
import {observer} from "mobx-react";
import {Sprite} from "../lib/Sprite";
import {smoke} from "../../assets/sprites";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {grid} from "../config/Grid";
import {commonStyles} from "../config/styles";

@observer
export class Loading extends AppStateComponent<{target: Path}> {
  private allowNavigation: boolean;
  @observable private isLoading: boolean;
  @observable private backgroundUrl: any = require("../../assets/images/loading-bg.jpg");

  async componentWillMount () {
    this.allowNavigation = true;

    this.isLoading = true;
    await preloadAssetsForTarget(this.props.target);
    this.isLoading = false;

    if (this.allowNavigation) {
      this.appState.router.goto(this.props.target);
    }
  }

  componentWillUnmount () {
    this.allowNavigation = false;
  }

  render () {
    return (
      <div className={css(styles.container)}
           style={{backgroundImage: `url(${this.backgroundUrl})`}}>
        <div className={css(styles.box)}>
          {this.props.target ? this.props.target.toString() : "Loading"}
        </div>
        <div className={css(commonStyles.fill)}/>
        <div className={css(styles.box, styles.footer)}>
          <p>Lorem ipsum dolor sit amet.</p>
          <Sprite {...smoke} classStyle={styles.torch}/>
        </div>
      </div>
    );
  }
}

function preloadAssetsForTarget (target: Path) {
  console.warn("Not implemented");
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundSize: "cover",
    backgroundPosition: "50% 50%",
    paddingLeft: "25%",
    paddingRight: "25%",
    paddingTop: "10%",
    paddingBottom: "10%"
  },

  box: {
    backgroundColor: "black",
    borderTop: "2px solid #333",
    borderBottom: "2px solid #333",
    padding: 10,
    alignItems: "center"
  },

  footer: {
    height: 75
  },

  torch: {
    width: grid.vh(20),
    height: grid.vh(20)
  }
});
