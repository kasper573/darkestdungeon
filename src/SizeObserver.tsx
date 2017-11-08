import * as React from "react";
import * as ReactDOM from "react-dom";
import {Size} from "./Bounds";
import {ResizeObserver} from "./ResizeObserver";
import {css, StyleSheet} from "aphrodite";

export class SizeObserver extends React.Component<{
  onSizeChanged: (size: Size) => void
}> {
  private domNode: Element;
  private resizeObserver: ResizeObserver;

  componentDidMount () {
    this.domNode = ReactDOM.findDOMNode(this);
    this.resizeObserver = new ResizeObserver(() => this.onSizeChanged());
    this.resizeObserver.observe(this.domNode);
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.domNode);
  }

  render () {
    return (
      <div className={css(styles.container)}/>
    );
  }

  onSizeChanged () {
    this.props.onSizeChanged({
      width: this.domNode.clientWidth,
      height: this.domNode.clientHeight
    });
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    pointerEvents: "none"
  }
});
