import * as React from "react";
import {AppState} from "./AppState";
import {PopupHandle, PopupAlign, PopupContent} from "./PopupState";
import {TooltipArea, TooltipSide} from "./TooltipArea";
import {css, StyleSheet} from "aphrodite";
import {observable, transaction} from "mobx";
import {observer} from "mobx-react";

@observer
export class PopupTester extends React.Component<{state: AppState}> {
  @observable popupQueue: Array<[PopupContent, PopupAlign]> = [];

  render () {
    const placementInfo = this.popupQueue.length > 0 && (
      "Click to place popup"
    );

    const placementButtons = Object.values(PopupAlign)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <button key={key} onClick={() => this.push(<Anything/>, (PopupAlign as any)[key])}>
          {key}
        </button>
      ));

    const tooltipAreas = Object.values(TooltipSide)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <TooltipArea
          key={key}
          className={css(styles.tooltipAreas)} side={(TooltipSide as any)[key]}
          popups={this.props.state.popups} tip={<Anything/>}>
          {key}
        </TooltipArea>
      ));

    return (
      <div className={css(styles.fill)}>
        <h1>Popup Tester</h1>
        <br/>
        <div style={{flexDirection: "row"}}>
          <span>Align: </span>
          {placementButtons}
          {placementInfo}
        </div>
        <br/>
        <div className={css(styles.fill)} onClick={(e) => this.pop(e)}>
          <h1>Tooltips</h1>
          <br/>
          <div style={{flexDirection: "row"}}>
            {tooltipAreas}
          </div>
        </div>
      </div>
    );
  }

  push<P> (content: PopupContent<P>, align: PopupAlign) {
    this.popupQueue.push([content, align]);
  }

  pop (e: React.MouseEvent<HTMLDivElement>) {
    if (this.popupQueue.length > 0) {
      const [content, align] = this.popupQueue.shift();
      this.props.state.popups.show(content, align, {x: e.clientX, y: e.clientY});
    }
  }
}

@observer
class Anything extends React.Component<{handle?: PopupHandle}> {
  private intervalId: any;

  @observable items: number[] = [];

  componentWillMount () {
    this.intervalId = setInterval(() => this.randomizeItems(), 500);
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  private randomizeItems () {
    transaction(() => {
      this.items = [];
      const numItems = Math.floor(Math.random() * 3);
      for (let i = 0; i < numItems; i++) {
        this.items.push(i);
      }
    });
  }

  render () {
    return (
      <div className={css(styles.anything)}>
        <h1>Anything</h1>
        <ul>
          {this.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <span onClick={() => this.props.handle.close()}>Close me!</span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },

  anything: {
    border: "2px solid green",
    backgroundColor: "black",
    color: "white",
    padding: 10,
  },

  tooltipAreas: {
    marginLeft: "20px"
  }
});
