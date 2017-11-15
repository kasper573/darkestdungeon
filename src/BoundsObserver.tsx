import * as React from "react";
import {Bounds} from "./Bounds";
import {css, StyleSheet} from "aphrodite";
import {AppStateComponent} from "./AppStateComponent";

// HACK this implementation is quite CPU intensive
export class BoundsObserver extends AppStateComponent<{
  onBoundsChanged: (size: Bounds) => void
}> {
  private domNode: Element;
  private pollIntervalId: any;
  private lastBounds: ClientRect;

  componentDidMount () {
    this.pollIntervalId = setInterval(() => this.pollBounds(), 125);
    this.pollBounds();
  }

  componentWillUnmount () {
    clearInterval(this.pollIntervalId);
  }

  render () {
    return (
      <div
        ref={(node) => this.domNode = node}
        className={css(styles.container)}
      />
    );
  }

  pollBounds () {
    const n = this.domNode;
    const absRect = n.getBoundingClientRect();

    if (JSON.stringify(this.lastBounds) === JSON.stringify(absRect)) {
      return;
    }

    this.lastBounds = absRect;

    // Get bounds ignoring transforms
    // HACK only ignores the app transform, any other transforms will mess this up
    const {x, y} = this.appState.bounds.transformClientPoint(
      absRect.left, absRect.top
    );

    const newBounds = new Bounds(
      x, y,
      absRect.width / this.appState.bounds.scale,
      absRect.height / this.appState.bounds.scale
    );

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
