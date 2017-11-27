import {identifier, list, object, reference, serializable} from "serializr";
import uuid = require("uuid");
import {QuirkInfo} from "./QuirkInfo";
import {StaticState} from "../StaticState";
import {Item} from "./Item";
import {TurnStats} from "./Stats";
import {observable} from "mobx";

export type CurioId = string;

export class Curio {
  @serializable(identifier()) id: CurioId = uuid();
  @serializable name: string = "";
  @serializable(object(TurnStats)) buff: TurnStats = null;
  @serializable(list(object(Item))) @observable items: Item[] = [];
  @serializable @observable hasBeenInteractedWith: boolean = false;

  @serializable(reference(QuirkInfo, StaticState.lookup((i) => i.quirks)))
  quirk: QuirkInfo = null;
}
