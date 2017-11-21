export class BuildingUpgradeEffects {
  size: number = 0;
  level: number = 0;
  cost: number = 0;
  recovery: number = 0;

  add (other: BuildingUpgradeEffects) {
    const sum = new BuildingUpgradeEffects();
    sum.size = this.size + other.size;
    sum.level = this.level + other.level;
    sum.cost = this.cost + other.cost;
    sum.recovery = this.recovery + other.recovery;
    return sum;
  }
}
