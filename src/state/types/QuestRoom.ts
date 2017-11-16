import {Vector} from "./Vector";
import {identifier, list, object, serializable} from "serializr";
import {Curio} from "./Curio";
import uuid = require("uuid");

export type MapLocationId = string;

export class QuestRoom {
  @serializable(identifier()) id: MapLocationId = uuid();
  @serializable(list(object(Curio))) curios: Curio[] = [];
  @serializable(object(Vector))
  coordinates: Vector;

  static walk (
    memory: Map<string, QuestRoom> = new Map<string, QuestRoom>(),
    stepsLeft: number = 10,
    coordinates: Vector = new Vector()
  ) {
    const roomId = coordinates.id;
    const room = memory.get(roomId) || new QuestRoom();
    room.coordinates = coordinates;
    memory.set(roomId, room);

    if (stepsLeft <= 0) {
      return room;
    }

    const direction: Vector = Math.random() > 0.5 ?
      new Vector(Math.random() ? -1 : 1, 0) :
      new Vector(0, Math.random() ? -1 : 1);

    const nextCoordinate = coordinates.add(direction);

    QuestRoom.walk(memory, stepsLeft - 1, nextCoordinate);

    return room;
  }
}
