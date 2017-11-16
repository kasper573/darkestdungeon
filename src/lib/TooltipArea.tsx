import * as React from "react";
import {computed, observable} from "mobx";
import {Tooltip} from "../ui/Tooltip";
import {BoundsObserver} from "./BoundsObserver";
import {css} from "aphrodite";
import {AppStateComponent} from "../AppStateComponent";
import {Bounds, Point, Size} from "../Bounds";
import {grid} from "../config/Grid";
import {observer} from "mobx-react";
import {SizeObserver} from "./SizeObserver";

export enum TooltipSide {
  Above,
  Right,
  Below,
  Left
}

type TooltipAreaProps = {
  tip?: any,
  side?: TooltipSide,
  classStyle?: any,
  style?: any,
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
@observer
export class TooltipArea extends AppStateComponent<TooltipAreaProps> {
  static defaultProps = {
    side: TooltipSide.Below
  };

  @observable private isHovered = false;
  @observable private areaBounds: Bounds = new Bounds();
  @observable private tooltipSize: Size = {width: 0, height: 0};

  @computed get isTooltipVisible () {
    return this.props.tip && (
      this.props.show !== undefined ? this.props.show : this.isHovered
    );
  }

  @computed get adjustedSide () {
    const offset = this.getTooltipOffset(this.props.side);
    const projectedBounds = new Bounds(
      this.areaBounds.x + offset.x,
      this.areaBounds.y + offset.y,
      this.tooltipSize.width,
      this.tooltipSize.height
    );

    if (projectedBounds.left < 0) {
      return TooltipSide.Right;
    } else if (projectedBounds.right > grid.width) {
      return TooltipSide.Left;
    } else if (projectedBounds.top < 0) {
      return TooltipSide.Below;
    } else if (projectedBounds.bottom > grid.height) {
      return TooltipSide.Above;
    }
    return this.props.side;
  }

  @computed get tooltipStyle (): any {
    const {x, y} = this.getTooltipOffset(this.adjustedSide);
    return {
      zIndex: 1,
      position: "absolute",
      left: x,
      top: y,
      pointerEvents: "none"
    };
  }

  getTooltipOffset (side: TooltipSide): Point {
    switch (side) {
      case TooltipSide.Above:
        return {
          y: -this.tooltipSize.height,
          x: (this.areaBounds.width - this.tooltipSize.width) / 2
        };
      case TooltipSide.Right:
        return {
          x: this.areaBounds.width,
          y: (this.areaBounds.height - this.tooltipSize.height) / 2
        };
      case TooltipSide.Below:
        return {
          y: this.areaBounds.height,
          x: (this.areaBounds.width - this.tooltipSize.width) / 2
        };
      case TooltipSide.Left:
        return {
          x: -this.tooltipSize.width,
          y: (this.areaBounds.height - this.tooltipSize.height) / 2
        };
    }
  }

  render () {
    const tip = this.isTooltipVisible && (
      <Tooltip>{this.props.tip}</Tooltip>
    );

    return (
      <div
        className={css(this.props.classStyle)}
        style={this.props.style}
        onMouseEnter={() => this.isHovered = true}
        onMouseLeave={() => this.isHovered = false}>

        {this.props.children}
        <BoundsObserver onBoundsChanged={(bounds) => this.areaBounds = bounds}/>

        <div style={this.tooltipStyle}>
          {tip}
          <SizeObserver onSizeChanged={(size) => this.tooltipSize = size}/>
        </div>
      </div>
    );
  }
}
