import * as React from "react";
import {TitleHeader} from "../../ui/TitleHeader";
import {profileEntrySpacing, ProfileList, visibleProfileEntries} from "./ProfileList";
import {css, StyleSheet} from "aphrodite";
import {pauseIcon, PauseMenu} from "../../ui/PauseMenu";
import {AppStateComponent} from "../../AppStateComponent";
import {Profile} from "../../state/types/Profile";
import {Icon, IconHighlightType} from "../../ui/Icon";
import {commonColors, commonStyleFn} from "../../config/styles";
import {grid} from "../../config/Grid";
import {InputBinding} from "../../state/InputState";
import {Input} from "../../config/Input";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {CommonButton} from "../../ui/CommonButton";
import {profileEntryHeight} from "./ProfileEntry";

@observer
export class Start extends AppStateComponent {
  @observable isContentOffset = false;

  transitionOut () {
    console.warn("Not implemented");
    return Promise.resolve();
  }

  goBack () {
    if (this.isContentOffset) {
      this.isContentOffset = false;
    } else {
      this.pause();
    }
  }

  pause () {
    this.appState.popups.show({
      id: "pause",
      content: <PauseMenu mainMenu={false}/>
    });
  }

  render () {
    return (
      <div className={css(styles.start)}>
        <div className={css(styles.content, this.isContentOffset && styles.contentOffset)}>
          <div className={css(styles.skybox)}>
            <div className={css(styles.estate)}/>
          </div>
          <div className={css(styles.contentBelow)}>
            <CommonButton
              color={commonColors.gold}
              classStyle={styles.campaignButton}
              label="Campaign"
              onClick={() => this.isContentOffset = true}
            />
            <ProfileList onProfileSelected={(profile) => this.onProfileSelected(profile)}/>
          </div>
        </div>

        <TitleHeader classStyle={styles.title}/>
        <Icon
          src={pauseIcon}
          size={grid.ySpan(1.5)}
          highlight={IconHighlightType.Lines}
          classStyle={styles.pauseMenuIcon}
          onClick={() => this.pause()}
        />

        <InputBinding match={Input.back} callback={() => this.goBack()}/>
      </div>
    );
  }

  async onProfileSelected (profile: Profile) {
    if (!profile.isNameFinalized) {
      return;
    }

    await this.transitionOut();
    this.appState.profiles.setActiveProfile(profile.id);
    this.appState.router.goto(profile.path);
  }
}

const contentBelowHeight = profileEntryHeight * visibleProfileEntries +
  profileEntrySpacing * (visibleProfileEntries - 1);
const contentBelowPadding = grid.ySpan(1);
const contentBelowOffset = contentBelowHeight + contentBelowPadding;
const styles = StyleSheet.create({
  start: {
    flex: 1
  },

  // Static elements

  title: {
    marginTop: grid.paddingTop
  },

  pauseMenuIcon: {
    position: "absolute",
    bottom: grid.paddingBottom,
    right: grid.paddingRight
  },

  // Content elements

  content: {
    ...commonStyleFn.dock(),
    transition: "transform 1s ease-in-out"
  },

  contentOffset: {
    transform: `translate(0, -${contentBelowOffset}px)`
  },

  skybox: {
    backgroundImage: `url(${require("../../../assets/dd/images/fe_flow/title_bg.png")})`,
    backgroundSize: "cover",
    backgroundPosition: "50% 100%",
    backgroundRepeat: "no-repeat",
    width: grid.outerWidth,
    height: grid.outerHeight,
    justifyContent: "flex-end"
  },

  estate: {
    backgroundImage: `url(${require("../../../assets/dd/images/fe_flow/title_house.png")})`,
    backgroundSize: "100% auto",
    backgroundPosition: "50% 0%",
    backgroundRepeat: "no-repeat",
    height: grid.ySpan(10)
  },

  contentBelow: {
    backgroundColor: "black",
    alignItems: "center",

    height: contentBelowHeight,
    padding: contentBelowPadding,
    paddingTop: 0,

    // HACK avoids red line glitch that probably happens due to scaling and sub pixel rendering
    top: -1,
    marginBottom: -2
  },

  campaignButton: {
    position: "absolute",
    top: -contentBelowPadding - grid.ySpan(1)
  },

  profiles: {

  }
});
