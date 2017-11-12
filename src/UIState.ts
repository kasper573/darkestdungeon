import {computed, observable} from "mobx";
import {Bounds, Point, Size} from "./Bounds";

export class UIState {
  @observable appSize: Size = {width: 1, height: 1};
  @observable aspectRatio: number = 1920 / 1080;

  /**
   * The size of the UI inside the ARC borders.
   * We consider this the actual "game viewport".
   *
   * Always matches our configured aspectRatio.
   */
  @computed get size (): Size {
    const appBounds = new Bounds(0, 0, this.appSize.width, this.appSize.height);
    return Bounds.fitRatio(appBounds, this.aspectRatio);
  }

  /**
   * Aspect ratio correction.
   *
   * We force the UI to maintain a certain
   * aspect ratio by adding black borders.
   */
  @computed get arcSize (): Size {
    return {
      width: (this.appSize.width - this.size.width) / 2,
      height: (this.appSize.height - this.size.height) / 2
    };
  }

  /**
   * The center position of the game viewport.
   */
  @computed get centerPosition (): Point {
    return {
      x: this.size.width / 2,
      y: this.size.height / 2
    };
  }
}
