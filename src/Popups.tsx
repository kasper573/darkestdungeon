import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {PopupState} from "./PopupState";
import {observer} from "mobx-react";
import {Popup} from "./Popup";
import {UIState} from "./UIState";
import {SizeObserver} from "./SizeObserver";
import {Size} from "./Bounds";
import * as TransitionGroup from "react-transition-group/TransitionGroup";
import Transition from "react-transition-group/Transition";

@observer
export class Popups extends React.Component<{state: PopupState}> {
  private uiState = new UIState();

  updateUIState (containerSize: Size): any {
    this.uiState.centerPosition = {
      x: containerSize.width / 2,
      y: containerSize.height / 2
    };
  }

  renderPopups () {
    const elements: JSX.Element[] = [];
    for (const handle of this.props.state.map.values()) {
      elements.push(
        <Transition
          key={handle.id}
          timeout={handle.animate ? Popup.animateDuration : 0}
          className={css(styles.container)}>
          {(state: string) => (
            <Popup handle={handle} uiState={this.uiState} transitionState={state}/>
          )}
        </Transition>
      );
    }
    return elements;
  }

  render () {
    return (
      <div className={css(styles.container, styles.container)}>
        <TransitionGroup className={css(styles.container)}>
          {this.renderPopups()}
        </TransitionGroup>
        <SizeObserver onSizeChanged={(size) => this.updateUIState(size)}/>
      </div>
    );
  }
}

/**
 * We want the popup container to be a 0x0 element in the top left,
 * purely to act as a coordinate system for the screen.
 *
 * NOTE: Filling the screen surface would require us to turn off pointer events for the container,
 * which in turn would turn off pointer events for all popups, which is something we don't want.
 */
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, right: 0, bottom: 0, left: 0,
    pointerEvents: "none"
  }
});
