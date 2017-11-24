import {observable} from "mobx";
import {list, object, serializable} from "serializr";
import {Character} from "./Character";

export class Battle {
  @serializable @observable round: number = 0;
  @serializable(list(object(Character))) @observable monsters: Character[] = [];
}
