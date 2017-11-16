import {identifier, serializable} from "serializr";

export class DungeonInfo {
  @serializable(identifier()) id: string;
  name: string;
}
