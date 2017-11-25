import {list, object, serializable} from "serializr";
import {QuestRoom} from "./QuestRoom";
import {Bounds} from "../../Bounds";
import {DungeonInfo} from "./DungeonInfo";

export class QuestMap {
  @serializable(list(object(QuestRoom))) rooms: QuestRoom[];
  @serializable(object(QuestRoom)) entrance: QuestRoom;
  @serializable size: MapSize = MapSize.Short;

  get bounds () {
    return QuestMap.findBoundingBox(this.rooms);
  }

  static generate (dungeonInfo: DungeonInfo, size: MapSize) {
    const memory = new Map<string, QuestRoom>();
    const m = new QuestMap();
    m.size = size;
    m.entrance = QuestRoom.walk(dungeonInfo, memory, 1,
      (room, coords) => !(coords.x === 0 && coords.y === 0) // No monsters in the entrance
    );
    m.rooms = Array.from(memory.values());
    return m;
  }

  static findBoundingBox (rooms: QuestRoom[]) {
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;
    rooms.forEach((room) => {
      if (room.coordinates.x < minX) { minX = room.coordinates.x; }
      if (room.coordinates.x > maxX) { maxX = room.coordinates.x; }
      if (room.coordinates.y < minY) { minY = room.coordinates.y; }
      if (room.coordinates.y > maxY) { maxY = room.coordinates.y; }
    });
    return new Bounds(minX, minY, maxX - minX + 1, maxY - minY + 1);
  }
}

export enum MapSize {
  Short = "Short",
  Medium = "Medium",
  Long = "Long"
}
