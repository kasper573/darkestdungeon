import {list, object, serializable} from "serializr";
import {QuestRoom} from "./QuestRoom";
import {Bounds} from "../../Bounds";

export class QuestMap {
  @serializable(list(object(QuestRoom))) rooms: QuestRoom[];
  @serializable(object(QuestRoom)) entrance: QuestRoom;
  @serializable size: MapSize = MapSize.Short;

  get bounds () {
    return QuestMap.findBoundingBox(this.rooms);
  }

  static generate (size: MapSize) {
    const memory = new Map<string, QuestRoom>();
    const m = new QuestMap();
    m.size = size;
    m.entrance = QuestRoom.walk(memory, 16);
    m.rooms = Array.from(memory.values());
    return m;
  }

  static findBoundingBox (rooms: QuestRoom[]) {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    rooms.forEach((room) => {
      if (room.coordinates.x < minX) { minX = room.coordinates.x; }
      if (room.coordinates.x > maxX) { maxX = room.coordinates.x; }
      if (room.coordinates.y < minY) { minY = room.coordinates.y; }
      if (room.coordinates.y > maxY) { maxY = room.coordinates.y; }
    });
    return new Bounds(0, 0, maxX - minX, maxY - minY);
  }
}

export enum MapSize {
  Short = "Short",
  Medium = "Medium",
  Long = "Long"
}
