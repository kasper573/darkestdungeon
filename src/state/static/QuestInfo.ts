export enum QuestType {
  Hunt = "Hunt",
  Explore = "Explore",
  Free = "Free"
}

export class QuestInfo {
  private constructor (
    public type: QuestType = QuestType.Free,
    public description: string = ""
  ) {}

  static hunt = new QuestInfo(QuestType.Hunt, "Hunt monsters");
  static explore = new QuestInfo(QuestType.Explore, "Explore rooms");
  static free = new QuestInfo(QuestType.Free, "Free roaming");
}
