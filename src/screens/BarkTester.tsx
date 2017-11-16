import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {Howl} from "howler";
import {AppStateComponent} from "../AppStateComponent";

const barks = [
  "Verse XXV: trust not armed men, for they seek to wound.",
  "My brethren fell to deaths cold embrace, Yet i stand alone against the countless horde!",
  "The key to a continued heartbeat is to MOVE YOUR FEET.",
  "I give my life, on the steps... To heaven!",
  "+++Divide By Cucumber Error. Please Reinstall Universe And Reboot +++"
];

@observer
export class BarkTester extends AppStateComponent {
  private barkBubble: BarkBubble;

  playRandomBark () {
    const randomIndex = Math.floor(Math.random() * barks.length);
    const randomBark = barks[randomIndex];
    this.barkBubble.bark(randomBark);
  }

  render () {
    return (
      <div>
        <button onClick={() => this.playRandomBark()}>
          Play bark
        </button>
        <BarkBubble ref={(b: BarkBubble) => this.barkBubble = b}/>
      </div>
    );
  }
}

@observer
class BarkBubble extends React.Component {
  @observable opacity: number = 0;
  @observable displayedText: string = "";
  originalText: string;
  isBarking: boolean;

  static fadeTime = 250;
  static finishWaitTimePerWord = 250;
  static letterInterval = 70;
  static letterSound = new Howl({src: [require("../../assets/dd/audio/ui_shr_text_loop.wav")]});
  static popupSound = new Howl({src: [require("../../assets/dd/audio/ui_shr_text_popup.wav")]});

  bark (text: string) {
    if (this.isBarking) {
      return;
    }

    this.isBarking = true;
    this.originalText = text;
    this.displayedText = "";
    const wordCount = text.split(/[\s:,.;]+/).length;

    BarkBubble.popupSound.play();

    this.fadeTo(1);
    this.showNextLetterAndContinue()
      .then(() => this.wait(BarkBubble.finishWaitTimePerWord * wordCount))
      .then(() => this.fadeTo(0))
      .then(() => this.isBarking = false);
  }

  showNextLetterAndContinue (): Promise<any> {
    return this.showNextLetter().then(() => {
      const weAreDone = this.originalText === this.displayedText;
      return weAreDone ?
        Promise.resolve() :
        this.showNextLetterAndContinue();
    });
  }

  showNextLetter () {
    requestAnimationFrame(() => BarkBubble.letterSound.play());
    this.displayedText = this.originalText.slice(0, this.displayedText.length + 1);
    return this.wait(BarkBubble.letterInterval);
  }

  fadeTo (opacity: number) {
    this.opacity = opacity;
  }

  private wait (time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  render () {
    return (
      <div className={css(styles.barkBubble)} style={{opacity: this.opacity}}>
        {this.displayedText}
      </div>
    );
  }
}

const styles = StyleSheet.create({
  barkBubble: {
    boxShadow: "0px 0px 1vw red",
    minHeight: 100,
    transition: "opacity " + BarkBubble.fadeTime + "ms",
  }
});
