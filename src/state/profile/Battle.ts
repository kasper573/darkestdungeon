import {observable} from "mobx";
import {serializable} from "serializr";

export class Battle {
  @serializable @observable round: number = 0;
}
