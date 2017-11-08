export class MusicState {
  private fader?: Fader;

  play (track: IHowlProperties) {
    const id = MusicState.getHowlId(track);

    if (this.fader && this.fader.id === id) {
      return;
    }

    this.stop();

    this.fader = new Fader(track);
    this.fader.play();
  }

  stop () {
    if (this.fader) {
      this.fader.stop();
      delete this.fader;
    }
  }

  static getHowlId (howl: IHowlProperties) {
    return JSON.stringify(howl.src);
  }
}

class Fader {
  static fadeTime: number = 1000;

  private howl: Howl;
  private initialVolume: number;

  public id: string;

  constructor (props: IHowlProperties) {
    this.id = MusicState.getHowlId(props);
    this.howl = new Howl({...props, loop: true});
    this.initialVolume = this.howl.volume();
  }

  play () {
    this.howl.off("fade"); // Cancels any pending stop calls
    this.howl.play();
    this.howl.fade(0, this.initialVolume, Fader.fadeTime);
  }

  stop () {
    this.howl.fade(this.initialVolume, 0, Fader.fadeTime);
    this.howl.on("fade", () => {
      this.howl.stop();
      this.howl.unload();
    });
  }
}
