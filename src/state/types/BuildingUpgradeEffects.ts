export class BuildingUpgradeEffects {
  size: number = 0;
  level: number = 0;
  discount: number = 0;
  recovery: number = 0;

  add (other: BuildingUpgradeEffects) {
    const sum = new BuildingUpgradeEffects();
    sum.size = this.size + other.size;
    sum.level = this.level + other.level;
    sum.discount = this.discount + other.discount;
    sum.recovery = this.recovery + other.recovery;
    return sum;
  }
}
