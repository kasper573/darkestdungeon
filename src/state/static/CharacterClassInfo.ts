import {identifier, serializable} from "serializr";

export class CharacterClassInfo {
  @serializable(identifier()) id: string;
  name: string;
  avatarUrl: string = require("../../../assets/images/hero.png");
}
