import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {QuestRoom} from "../../state/types/QuestRoom";
import {grid} from "../../config/Grid";
import {Quest} from "../../state/types/Quest";
import {observer} from "mobx-react";

@observer
export class DungeonMap extends React.Component<{
  quest: Quest
}> {
  render () {
    const map = this.props.quest.map;
    const bounds = map.bounds.scale(cellSize, cellSize);
    return (
      <div style={{width: bounds.width, height: bounds.height}}>
        <div style={{position: "absolute", left: -bounds.left, top: -bounds.top}}>
          {map.rooms.map((room) =>
            <RoomOnMap
              key={room.coordinates.id}
              room={room}
              quest={this.props.quest}
            />
          )}
        </div>
      </div>
    );
  }
}

@observer
class RoomOnMap extends React.Component<{
  room: QuestRoom,
  quest: Quest
}> {

  render () {
    const room = this.props.room;
    const coords = room.coordinates;
    const isCurrentRoom = room.id === this.props.quest.currentRoomId;
    const isAccessible = isCurrentRoom || this.props.quest.canChangeToRoom(room.id);
    return (
      <div
        onClick={() => isAccessible && this.props.quest.changeRoom(room.id)}
        style={{top: coords.y * cellSize, left: coords.x * cellSize}}
        className={css([
          styles.room,
          isCurrentRoom && styles.current,
          isAccessible && styles.accessible,
          room.isScouted && styles.scouted
        ])}
      />
    );
  }
}

const cellSize = grid.gutter * 2;
const styles = StyleSheet.create({
  room: {
    position: "absolute",
    width: cellSize,
    height: cellSize,
    background: "gray",
    border: "1px solid gray",
    opacity: 0.5
  },

  current: {
    background: "blue"
  },

  scouted: {
    background: "green"
  },

  accessible: {
    opacity: 1,

    ":hover": {
      borderColor: "gold"
    }
  }
});
