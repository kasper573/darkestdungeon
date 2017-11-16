import {identifier, serializable} from "serializr";
import uuid = require("uuid");

export type CurioId = string;

export class Curio {
  @serializable(identifier()) id: CurioId = uuid();
  @serializable name: string;
}
