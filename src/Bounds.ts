export class Bounds {
  constructor (
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0
  ) {}

  public static fitRatio (container: Bounds, boxAspectRatio: number) {
    let adjustedWidth = container.width;
    let adjustedHeight = adjustedWidth / boxAspectRatio;
    if (adjustedHeight > container.height) {
      adjustedHeight = container.height;
      adjustedWidth = adjustedHeight * boxAspectRatio;
    }

    const yOffset = (container.height - adjustedHeight) / 2;
    const xOffset = (container.width - adjustedWidth) / 2;
    return new Bounds(xOffset, yOffset, adjustedWidth, adjustedHeight);
  }

  scale (xScale: number, yScale: number) {
    return new Bounds(this.x, this.y, this.width * xScale, this.height * yScale);
  }
}
