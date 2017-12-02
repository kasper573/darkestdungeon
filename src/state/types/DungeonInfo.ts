import {identifier, serializable} from "serializr";
import {CharacterTemplate} from "./CharacterTemplate";

export class DungeonInfo {
  @serializable(identifier()) id: string;
  name: string;
  monsters: CharacterTemplate[] = [];
  imageUrl: string;
  isStartingDungeon: boolean;
}
