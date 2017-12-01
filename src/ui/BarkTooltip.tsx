import {IObservableValue, observable} from "mobx";
import * as React from "react";
import {observer} from "mobx-react";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {grid} from "../config/Grid";

@observer
export class BarkTooltip extends AppStateComponent<{
  barkState?: IObservableValue<boolean>
}> {
  @observable displayedText: string = "";
  originalText: string;
  isCanceled: boolean;

  // Make it possible to initialize bark state externally
  defaultBarkState = observable(false);
  get barkState () {
    return this.props.barkState || this.defaultBarkState;
  }

  static finishWaitTimePerWord = 250;
  static finishWaitTimeMin = 3000;
  static letterInterval = 70;
  static letterSound = {src: [require("../../assets/dd/audio/ui_shr_text_loop.wav")], volume: 0.4};
  static popupSound = {src: [require("../../assets/dd/audio/ui_shr_text_popup.wav")]};

  componentWillUnmount () {
    this.isCanceled = true;
  }

  bark (text: string) {
    if (this.barkState.get()) {
      return;
    }

    this.barkState.set(true);
    this.originalText = text;
    this.displayedText = "";
    const wordCount = text.split(/[\s:,.;]+/).length;

    this.appState.sfx.play(BarkTooltip.popupSound);

    const readTime = Math.max(BarkTooltip.finishWaitTimePerWord * wordCount, BarkTooltip.finishWaitTimeMin);

    return this.showNextLetterAndContinue()
      .then(() => this.wait(readTime))
      .then(() => this.barkState.set(false));
  }

  showNextLetterAndContinue (): Promise<any> {
    return this.showNextLetter().then(() => {
      const weAreDone = this.originalText === this.displayedText || this.isCanceled;
      return weAreDone ?
        Promise.resolve() :
        this.showNextLetterAndContinue();
    });
  }

  showNextLetter () {
    requestAnimationFrame(() => this.appState.sfx.play(BarkTooltip.letterSound));
    this.displayedText = this.originalText.slice(0, this.displayedText.length + 1);
    return this.wait(BarkTooltip.letterInterval);
  }

  private wait (time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  render () {
    return (
      <div className={css(styles.barkTooltip)}>
        {this.displayedText}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  barkTooltip: {
    maxWidth: grid.xSpan(3.5),
    padding: grid.ySpan(0.5),
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});
