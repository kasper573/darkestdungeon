import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {PopupAlign, PopupHandle} from "./PopupState";
import {ReactElement} from "react";
import {computed, observable, transaction} from "mobx";
import {observer} from "mobx-react";
import {SizeObserver} from "./SizeObserver";
import {Size} from "./Bounds";
import {UIState} from "./UIState";

@observer
export class Popup extends React.Component<{
  handle: PopupHandle,
  uiState: UIState
}> {
  @observable private contentWidth: number = 0;
  @observable private contentHeight: number = 0;

  @computed get alignedPosition () {
    const p = this.props.handle.position || this.props.uiState.centerPosition;
    switch (this.props.handle.align) {
      case PopupAlign.Top:
        return {
          x: p.x - this.contentWidth / 2,
          y: p.y
        };
      case PopupAlign.Right:
        return {
          x: p.x - this.contentWidth,
          y: p.y - this.contentHeight / 2
        };
      case PopupAlign.Bottom:
        return {
          x: p.x - this.contentWidth / 2,
          y: p.y - this.contentHeight
        };
      case PopupAlign.Left:
        return {
          x: p.x,
          y: p.y - this.contentHeight / 2
        };
      case PopupAlign.Center:
        return {
          x: p.x - this.contentWidth / 2,
          y: p.y - this.contentHeight / 2
        };
      case PopupAlign.TopLeft:
        return p;
    }
  }

  render () {
    let content = this.props.handle.content;
    if (typeof content !== "string") {
      content = React.cloneElement(
        content as ReactElement<{handle: PopupHandle}>,
        {handle: this.props.handle}
      );
    }

    return (
      <div className={css(styles.container)} style={{
        left: this.alignedPosition.x,
        top: this.alignedPosition.y
      }}>
        {content}
        <SizeObserver onSizeChanged={(size) => this.updateContentSize(size)}/>
      </div>
    );
  }

  private updateContentSize (size: Size) {
    transaction(() => {
      this.contentWidth = size.width;
      this.contentHeight = size.height;
    });
  }
}

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    pointerEvents: "all"
  }
});
