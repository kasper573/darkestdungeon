import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {observer} from "mobx-react";
import {IReactionDisposer, observable, reaction} from "mobx";
import {Howl} from "howler";
import {AmbienceController, AmbienceDefinition} from "./AmbienceController";

class BuildingInfo {
  constructor (
    public id: string
  ) {}
}

const buildings = [
  new BuildingInfo("abbey"),
  new BuildingInfo("blacksmith"),
  new BuildingInfo("graveyard"),
  new BuildingInfo("sanitarium"),
  new BuildingInfo("tavern"),
  new BuildingInfo("guild"),
  new BuildingInfo("coach"),
  new BuildingInfo("town")
];

const barks = [
  "Verse XXV: trust not armed men, for they seek to wound.",
  "My brethren fell to deaths cold embrace, Yet i stand alone against the countless horde!",
  "The key to a continued heartbeat is to MOVE YOUR FEET.",
  "I give my life, on the steps... To heaven!",
  "+++Divide By Cucumber Error. Please Reinstall Universe And Reboot +++"
];

const ambienceController = new AmbienceController({
  "town": new AmbienceDefinition(
    {src: require("../assets/dd/audio/amb_town_gen_base.wav")},
    [
      {src: require("../assets/dd/audio/amb_town_gen_base_os_01.wav")},
      {src: require("../assets/dd/audio/amb_town_gen_base_os_02.wav")},
      {src: require("../assets/dd/audio/amb_town_gen_base_os_03.wav")}
    ]
  ),
  "coach": "town",
  "tavern": new AmbienceDefinition(
    {src: require("../assets/dd/audio/amb_town_tavern.wav")},
    [
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_01.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_02.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_bar_03.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_01.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_02.wav")},
      {src: require("../assets/dd/audio/amb_town_tavern_os_chair_03.wav")}
    ]
  ),
});

@observer
export class SoundTester extends React.Component {
  static defaultBuildingId = "town";

  @observable private activeBuildingId = SoundTester.defaultBuildingId;
  @observable private isAmbienceVolumeLowered: boolean;
  private barkBubble: BarkBubble;
  private reactionDisposers: IReactionDisposer[];

  playRandomBark () {
    const randomIndex = Math.floor(Math.random() * barks.length);
    const randomBark = barks[randomIndex];
    this.barkBubble.bark(randomBark);
  }

  componentWillMount () {
    // Change to ambience of activeBuildingId whenever it changes
    this.reactionDisposers = [
      reaction(
        () => this.activeBuildingId,
        (buildingId) => ambienceController.activate(buildingId),
        true
      ),
      reaction(
        () => this.isAmbienceVolumeLowered,
        (isVolumeLowered) => ambienceController.muffle(isVolumeLowered),
        true
      )
    ];
  }

  componentWillUnmount () {
    this.reactionDisposers.forEach((dispose) => dispose());
    ambienceController.deactivate();
  }

  render () {
    const buildingElements = buildings.map((b) => (
      <Building
        {...b}
        key={b.id}
        isActive={b.id === this.activeBuildingId}
        onSelected={() => this.activeBuildingId = b.id}
        onDeselected={() => this.activeBuildingId = SoundTester.defaultBuildingId}
      />
    ));

    return (
      <div>
        <h1>Sound Tester</h1>
        <ul className={css(styles.buildingRow)}>
          {buildingElements}
        </ul>
        <button onClick={() => this.isAmbienceVolumeLowered = !this.isAmbienceVolumeLowered}>
          Toggle ambience volume
        </button>
        <button onClick={() => this.playRandomBark()}>
          Play bark
        </button>
        <BarkBubble ref={(b: BarkBubble) => this.barkBubble = b}/>
      </div>
    );
  }
}

class Building extends React.Component<
  BuildingInfo & {
  isActive?: boolean,
  onSelected?: () => void,
  onDeselected?: () => void,
}> {
  static defaultProps = {
    onSelected: (): any => null,
    onDeselected: (): any => null
  };

  render () {
    const activeIndicator = this.props.isActive ? " X" : "";
    return (
      <li className={css(styles.building)} onClick={() => this.onClicked()}>
        {this.props.id}
        {activeIndicator}
      </li>
    );
  }

  onClicked () {
    if (this.props.isActive) {
      this.props.onDeselected();
    } else {
      this.props.onSelected();
    }
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
  static letterSound = new Howl({src: [require("../assets/dd/audio/ui_shr_text_loop.wav")], volume: 0.25});
  static popupSound = new Howl({src: [require("../assets/dd/audio/ui_shr_text_popup.wav")]});

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
  buildingRow: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  building: {
    width: "25%",
    boxShadow: "0px 0px 1vw red",
    transition: "box-shadow 0.5s",
    padding: 10,
    margin: 10,

    ":hover": {
      boxShadow: "0px 0px 5vw red",
    },

    ":active": {
      boxShadow: "0px 0px 1vw red",
    }
  },
  barkBubble: {
    boxShadow: "0px 0px 1vw red",
    minHeight: 100,
    transition: "opacity " + BarkBubble.fadeTime + "ms",
  }
});
