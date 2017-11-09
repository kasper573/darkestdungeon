import * as React from "react";
import {PopupHandle, PopupAlign, PopupContent, PopupState, ModalState} from "./PopupState";
import {computed, IReactionDisposer, observable, reaction} from "mobx";
import {Tooltip} from "./Tooltip";
import {BoundsObserver, ElementBounds} from "./BoundsObserver";

export enum TooltipSide {
  Above,
  Right,
  Below,
  Left
}

const sideAlignMap = {
  [TooltipSide.Above]: PopupAlign.Bottom,
  [TooltipSide.Right]: PopupAlign.Left,
  [TooltipSide.Below]: PopupAlign.Top,
  [TooltipSide.Left]: PopupAlign.Right,
};

type TooltipAreaProps = {
  popups: PopupState,
  tip: PopupContent,
  side?: TooltipSide,
  className?: string,
  style?: any,
  mouse?: boolean,
  show?: boolean
};

/**
 * Opens a tooltip next to the area.
 * - Triggered when the mouse hovers the area
 * - Or manually by calling show/hide
 *
 * NOTE: Manually showing a tooltip disables mouse
 * triggers until you manually hide it again.
 */
export class TooltipArea extends React.Component<TooltipAreaProps> {
  static defaultProps = {
    side: TooltipSide.Below,
    mouse: true
  };

  private disposeReaction: IReactionDisposer;
  private popup: PopupHandle;
  private isOpenedByMouse: boolean;

  @observable bounds: ElementBounds;

  @computed get popupPosition () {
    if (!this.bounds) {
      return {x: 0, y: 0};
    }

    switch (this.props.side) {
      case TooltipSide.Above:
        return {
          x: this.bounds.absolutePosition.x + this.bounds.size.width / 2,
          y: this.bounds.absolutePosition.y
        };
      case TooltipSide.Right:
        return {
          x: this.bounds.absolutePosition.x + this.bounds.size.width,
          y: this.bounds.absolutePosition.y + this.bounds.size.height / 2
        };
      case TooltipSide.Below:
        return {
          x: this.bounds.absolutePosition.x + this.bounds.size.width / 2,
          y: this.bounds.absolutePosition.y + this.bounds.size.height
        };
      case TooltipSide.Left:
        return {
          x: this.bounds.absolutePosition.x,
          y: this.bounds.absolutePosition.y + this.bounds.size.height / 2
        };
    }
  }

  componentDidMount () {
    if (this.props.show) {
      this.show();
    }
  }

  componentWillUpdate (nextProps: TooltipAreaProps) {
    if (!this.props.show && nextProps.show) {
      this.show();
    } else if (this.props.show && !nextProps.show) {
      this.hide();
    }
  }

  componentWillUnmount () {
    this.hide();
  }

  show (tip = this.props.tip) {
    this.hide();

    this.popup = this.props.popups.show({
      content: <Tooltip>{tip}</Tooltip>,
      align: sideAlignMap[this.props.side],
      position: this.popupPosition,
      modalState: ModalState.Opaque,
      animate: false
    });

    this.disposeReaction = reaction(
      () => this.popupPosition,
      (position) => this.popup.reposition(position)
    );
  }

  hide () {
    if (this.popup) {
      this.disposeReaction();
      this.popup.close();
      delete this.disposeReaction;
      delete this.popup;
    }
  }

  render () {
    return (
      <div
        className={this.props.className}
        style={this.props.style}
        onMouseEnter={this.props.mouse ? () => this.onMouseEnter() : undefined}
        onMouseLeave={this.props.mouse ? () => this.onMouseLeave() : undefined}>
        {this.props.children}
        <BoundsObserver onBoundsChanged={(bounds) => this.bounds = bounds}/>
      </div>
    );
  }

  onMouseEnter () {
    // Ignore mouse trigger if tooltip has been opened externally
    if (!this.popup) {
      this.isOpenedByMouse = true;
      this.show();
    }
  }

  onMouseLeave () {
    if (this.isOpenedByMouse) {
      this.isOpenedByMouse = false;
      this.hide();
    }
  }
}
