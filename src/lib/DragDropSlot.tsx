import * as React from "react";
import {css} from "aphrodite";
const {DropTarget, DragSource} = require("react-dnd");

const SourceSpec = {
  beginDrag (props: DragDropSlotProps<{}>, monitor: any) {
    return {item: props.item};
  },

  canDrag (props: DragDropSlotProps<{}>, monitor: any) {
    return props.item && (!props.allowDrag || props.allowDrag(props.item));
  }
};

const TargetSpec = {
  drop (props: DragDropSlotProps<{}>, monitor: any, target: DragDropSlot<{}>) {
    if (target.props.onDrop) {
      target.props.onDrop(monitor.getItem().item);
    }
  },

  canDrop (props: DragDropSlotProps<{}>, monitor: any) {
    const item = monitor.getItem().item;
    if (item.constructor !== props.type) {
      return false;
    }
    return !props.allowDrop || props.allowDrop(item);
  }
};

export type DragDropSlotProps<T> = {
  // Custom API
  type: new () => T,
  item?: T,
  preview?: any,
  allowDrag?: (item: T) => boolean,
  allowDrop?: (item: T) => boolean,
  onDrop?: (item: T) => void,

  // DOM glue
  children?: any,
  onClick?: () => void,
  classStyle?: any,
  style?: any,

  // react-dnd internals
  isOver?: boolean,
  canDrop?: boolean,
  connectDropTarget?: any,
  connectDragSource?: any,
  connectDragPreview?: any
};

@DropTarget("slot", TargetSpec, (connect: any, monitor: any) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
@DragSource("slot", SourceSpec, (connect: any, monitor: any) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export class DragDropSlot<T> extends React.Component<DragDropSlotProps<T>> {
  componentDidMount () {
    if (this.props.preview) {
      this.props.connectDragPreview(this.props.preview);
    }
  }

  componentDidUpdate () {
    this.props.connectDragPreview(this.props.preview);
  }

  render () {
    const {isOver, canDrop} = this.props;
    const colorStyle = canDrop ? {
      background: isOver ? "green" : "yellow"
    } : undefined;

    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <div
          className={css(this.props.classStyle)}
          style={{...this.props.style, flex: 1, ...colorStyle}}
          onClick={this.props.onClick}>
          {this.props.children}
        </div>
      )
    );
  }
}
