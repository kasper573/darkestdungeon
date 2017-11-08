import * as React from "react";
import {css, StyleSheet} from "aphrodite";
import {PopupState} from "./PopupState";
import {observer} from "mobx-react";
import {Popup} from "./Popup";
import {UIState} from "./UIState";
import {SizeObserver} from "./SizeObserver";
import {Size} from "./Bounds";

@observer
export class Popups extends React.Component<{state: PopupState}> {
  private uiState = new UIState();

  updateUIState (containerSize: Size): any {
    this.uiState.centerPosition = {
      x: containerSize.width / 2,
      y: containerSize.height / 2
    };
  }

  render () {
    const elements: JSX.Element[] = [];
    this.props.state.map.forEach((handle, id) => {
      elements.push(<Popup key={id} handle={handle} uiState={this.uiState}/>);
    });

    return (
      <div className={css(styles.container)}>
        {elements}
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
