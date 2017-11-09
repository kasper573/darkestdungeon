import * as React from "react";
import {AppState} from "./AppState";
import {PopupHandle, PopupAlign, PopupContent, ModalState} from "./PopupState";
import {TooltipArea, TooltipSide} from "./TooltipArea";
import {css, StyleSheet} from "aphrodite";
import {observable, transaction} from "mobx";
import {observer} from "mobx-react";

@observer
export class PopupTester extends React.Component<{state: AppState}> {
  @observable popupQueue: Array<[PopupContent, PopupAlign, ModalState]> = [];

  renderPlacementButtons (modalState: ModalState) {
    return Object.values(PopupAlign)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <button key={key} onClick={
          (e: any) => {
            e.stopPropagation();
            this.push(<Anything/>, (PopupAlign as any)[key], modalState);
          }
        }>
          {key}
        </button>
      ));
  }

  render () {
    const popups = this.props.state.popups;

    const tooltipAreas = Object.values(TooltipSide)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <TooltipArea
          key={key}
          className={css(styles.tooltipAreas)} side={(TooltipSide as any)[key]}
          popups={popups} tip={<Anything/>}>
          {key}
        </TooltipArea>
      ));

    return (
      <div className={css(styles.fill)} onClick={(e) => this.pop(e)}>
        <div style={{flexDirection: "row"}}>
          <TooltipArea
            popups={popups} mouse={false} side={TooltipSide.Right}
            show={this.popupQueue.length > 0}
            tip="Click to place popup. Ctrl+click for default position.">
            Modal Popups
          </TooltipArea>
          <div style={{flex: 1}}/>
        </div>
        <br/>
        <div style={{flexDirection: "row"}}>
          <span>Align: </span>
          {this.renderPlacementButtons(ModalState.Modal)}
        </div>
        <br/>

        <h1>Modal Popups (dismissable)</h1>
        <br/>
        <div style={{flexDirection: "row"}}>
          <span>Align: </span>
          {this.renderPlacementButtons(ModalState.ModalDismiss)}
        </div>
        <br/>

        <h1>Opaque Popups</h1>
        <br/>
        <div style={{flexDirection: "row"}}>
          <span>Align: </span>
          {this.renderPlacementButtons(ModalState.Opaque)}
        </div>
        <br/>

        <h1>Tooltips</h1>
        <br/>
        <div style={{flexDirection: "row"}}>
          {tooltipAreas}
        </div>
        <br/>

        <button onClick={() => this.prompt()}>Prompt</button>
      </div>
    );
  }

  async prompt () {
    const Pop = ({handle}: {handle?: PopupHandle}) => (
      <div>
        Do you?
        <div style={{flexDirection: "row"}}>
          <span onClick={() => handle.close("yes")}>Yes</span>
          <span onClick={() => handle.close("no")}>No</span>
        </div>
      </div>
    );

    const popups = this.props.state.popups;
    const answer = await popups.prompt(<Pop/>);
    popups.show("You chose: " + answer);
  }

  push<P> (content: PopupContent<P>, align: PopupAlign, modalState: ModalState) {
    this.popupQueue.push([content, align, modalState]);
  }

  pop (e: React.MouseEvent<HTMLDivElement>) {
    if (this.popupQueue.length > 0) {
      const [content, align, modalState] = this.popupQueue.shift();
      const position = e.ctrlKey ? undefined : {x: e.clientX, y: e.clientY};
      this.props.state.popups.show({content, align, position, modalState});
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
    flex: 1,
    backgroundColor: "#999"
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
