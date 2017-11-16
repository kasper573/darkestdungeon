import {identifier, serializable} from "serializr";

export class AfflictionInfo {
  @serializable(identifier()) id: string;
  name: string;
}
