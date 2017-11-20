import {BuildingUpgradeInfo} from "./BuildingUpgradeInfo";

export class BuildingInfo {
  key: string;
  name: string;
  description: string;
  avatarUrl: string;
  backgroundUrl: string;

  children = new Map<string, BuildingInfo>();
  items: BuildingUpgradeInfo[] = [];
  parent: BuildingInfo;

  getItemsFlattened () {
    let flattenedItems = this.items;
    this.children.forEach((child) =>
      flattenedItems = flattenedItems.concat(child.getItemsFlattened())
    );
    return flattenedItems;
  }

  get id () {
    let next: BuildingInfo = this;
    const keys = [];
    while (next) {
      keys.push(next.key);
      next = next.parent;
    }
    return BuildingUpgradeInfo.createId(keys.reverse());
  }
}
