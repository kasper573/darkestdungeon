export class SFXPlayer {
  play (sf: IHowlProperties) {
    new Howl(sf).play();
  }
}
