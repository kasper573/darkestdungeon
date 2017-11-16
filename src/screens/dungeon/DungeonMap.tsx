import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {QuestMap, Room} from "../../state/ProfileState";

export class DungeonMap extends React.Component<{
  map: QuestMap
}> {
  render () {
    const rooms = this.props.map.rooms;
    const bounds = this.props.map.bounds.scale(gridSize, gridSize);
    return (
      <div style={{width: bounds.width, height: bounds.height}}>
        <div style={{position: "absolute", left: bounds.width / 2, top: bounds.height / 2}}>
          {rooms.map((room) =>
            <RoomOnMap key={room.coordinates.id} room={room}/>
          )}
        </div>
      </div>
    );
  }
}

class RoomOnMap extends React.Component<{room: Room}> {
  render () {
    const coords = this.props.room.coordinates;
    return (
      <div 
        className={css(styles.room)} 
        style={{top: coords.y * gridSize, left: coords.x * gridSize}}
      />
    );
  }
}

const gridSize = 10;
const styles = StyleSheet.create({
  room: {
    position: "absolute",
    width: gridSize,
    height: gridSize,
    background: "green",
    border: "1px solid gray"
  }
});
