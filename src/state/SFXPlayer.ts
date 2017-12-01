export class SFXPlayer {
  private isMuffled: boolean;

  play (sf: IHowlProperties) {
    const howl = new Howl(sf);
    if (this.isMuffled) {
      howl.volume(howl.volume() * 0.3);
    }
    howl.play();
  }

  muffle (isMuffled: boolean) {
    this.isMuffled = isMuffled;
  }
}
