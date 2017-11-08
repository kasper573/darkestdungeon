import * as React from "react";
import * as ReactDOM from "react-dom";
import {Point, Size} from "./Bounds";
import {css, StyleSheet} from "aphrodite";

export type ElementBounds = {
  relativePosition: Point,
  absolutePosition: Point,
  size: Size
};

// HACK this implementation is quite CPU intensive
export class BoundsObserver extends React.Component<{
  onBoundsChanged: (size: ElementBounds) => void
}> {
  private domNode: Element;
  private pollIntervalId: any;
  private lastBounds: ElementBounds;

  componentDidMount () {
    this.domNode = ReactDOM.findDOMNode(this);
    this.pollIntervalId = setInterval(() => this.onSizeChanged(), 125);
  }

  componentWillUnmount () {
    clearInterval(this.pollIntervalId);
  }

  render () {
    return (
      <div className={css(styles.container)}/>
    );
  }

  onSizeChanged () {
    const n = this.domNode;
    const absRect = n.getBoundingClientRect();
    const newBounds = {
      relativePosition: {x: n.clientLeft, y: n.clientTop},
      absolutePosition: {x: absRect.left, y: absRect.top},
      size: {width: n.clientWidth, height: n.clientHeight}
    };

    if (JSON.stringify(this.lastBounds) === JSON.stringify(newBounds)) {
      return;
    }

    this.lastBounds = newBounds;
    this.props.onBoundsChanged(newBounds);
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    pointerEvents: "none"
  }
});
