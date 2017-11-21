import * as React from "react";
import {css} from "aphrodite";
const {DropTarget, DragSource} = require("react-dnd");

const SourceSpec = {
  beginDrag (props: DragDropSlotProps<{}>, monitor: any) {
    if (props.onDragBegin) {
      props.onDragBegin(props.item, monitor);
    }
    return {item: props.item};
  },

  endDrag (props: DragDropSlotProps<{}>, monitor: any) {
    if (props.onDragEnd) {
      props.onDragEnd(monitor.getItem().item, monitor);
    }
  },

  canDrag (props: DragDropSlotProps<{}>) {
    return props.item && (!props.allowDrag || props.allowDrag(props.item));
  }
};

const TargetSpec = {
  drop (props: DragDropSlotProps<{}>, monitor: any, target: DragDropSlot<{}>) {
    if (target.props.onDrop) {
      // HACK make onDrop always get called after onDragEnd
      const item = monitor.getItem().item;
      requestAnimationFrame(() => target.props.onDrop(item));
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

type ContentType = React.ReactNode[] | React.ReactNode;
type ContentFunction<T> = (dragItem: T, isOver: boolean, isDragging: boolean,
                           canDrag: boolean, canDrop: boolean) => ContentType;

export type DragDropSlotProps<T> = {
  // Custom API
  type: new () => T,
  item?: T,
  preview?: any,
  allowDrag?: (item: T) => boolean,
  allowDrop?: (item: T) => boolean,
  onDrop?: (item: T) => void,
  onDragBegin?: (item: T, monitor: any) => void,
  onDragEnd?: (item: T, monitor: any) => void,

  // DOM glue
  children?: ContentType | ContentFunction<T>,
  onClick?: () => void,
  classStyle?: any,
  style?: any,

  // react-dnd internals
  isOver?: boolean,
  isDragging?: boolean,
  canDrag?: boolean,
  canDrop?: boolean,
  dragItem?: any,
  connectDropTarget?: any,
  connectDragSource?: any,
  connectDragPreview?: any
};

@DropTarget("slot", TargetSpec, (connect: any, monitor: any) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  dragItem: monitor.getItem()
}))
@DragSource("slot", SourceSpec, (connect: any, monitor: any) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  canDrag: monitor.canDrag(),
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
    const {dragItem, isOver, isDragging, canDrag, canDrop} = this.props;
    const colorStyle = canDrop ? {
      background: isOver ? "green" : "yellow"
    } : undefined;

    // Normalize this.props.children into always being a ContentFunction
    const childrenFn = typeof this.props.children === "function" ?
      this.props.children as ContentFunction<T>  :
      (() => this.props.children) as ContentFunction<T>;

    return this.props.connectDropTarget(
      this.props.connectDragSource(
        <div
          className={css(this.props.classStyle)}
          style={{...this.props.style, flex: 1, ...colorStyle}}
          onClick={this.props.onClick}>
          {childrenFn(dragItem && dragItem.item, isOver, isDragging, canDrag, canDrop)}
        </div>
      )
    );
  }
}
