import * as React from "react";
import {PopupAlign, PopupContent, ModalState} from "../state/PopupState";
import {TooltipArea, TooltipSide} from "../lib/TooltipArea";
import {css, StyleSheet} from "aphrodite";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {Popup, Prompt} from "../ui/Popups";
import {AppStateComponent} from "../AppStateComponent";

@observer
export class PopupTester extends AppStateComponent {
  @observable popupQueue: Array<[PopupContent, PopupAlign, ModalState]> = [];

  renderPlacementButtons (modalState: ModalState) {
    return Object.values(PopupAlign)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <button key={key} onClick={
          (e: any) => {
            e.stopPropagation();
            const align = (PopupAlign as any)[key];
            this.push(
              <Popup closeable><pre>{JSON.stringify({align, modalState}, null, 2)}</pre></Popup>,
              align,
              modalState
            );
          }
        }>
          {key}
        </button>
      ));
  }

  render () {
    const tooltipAreas = Object.values(TooltipSide)
      .filter((key) => typeof key === "string")
      .map((key) => (
        <TooltipArea
          key={key}
          classStyle={styles.tooltipAreas}
          side={(TooltipSide as any)[key]}
          tip={<Tip/>}>
          {key}
        </TooltipArea>
      ));

    return (
      <div className={css(styles.fill)} onClick={(e) => this.pop(e)}>
        <div style={{flexDirection: "row"}}>
          <TooltipArea
            side={TooltipSide.Right}
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
    const popups = this.appState.popups;
    const answer = await popups.prompt(<Prompt query="Do you?"/>);
    popups.show(<Popup>You chose: {JSON.stringify(answer)}</Popup>);
  }

  push<P> (content: PopupContent<P>, align: PopupAlign, modalState: ModalState) {
    this.popupQueue.push([content, align, modalState]);
  }

  pop (e: React.MouseEvent<HTMLDivElement>) {
    if (this.popupQueue.length > 0) {
      const [content, align, modalState] = this.popupQueue.shift();
      const position = !e.ctrlKey ?
        this.appState.bounds.transformClientPoint(e.clientX, e.clientY) :
        undefined;

      this.appState.popups.show({content, align, position, modalState});
    }
  }
}

@observer
class Tip extends React.Component {
  private intervalId: any;
  @observable private size = 0;

  @computed get messages () {
    const rows = [];
    for (let i = 0; i < this.size; i++) {
      let str = "";
      for (let n = 0; n < this.size; n++) {
        str += "W";
      }
      rows.push(str);
    }
    return rows;
  }

  componentWillMount () {
    this.intervalId = setInterval(() => this.size++, 150);
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  render () {
    return (
      <div style={{maxWidth: 300, maxHeight: 300, overflow: "hidden"}}>
        {this.messages.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
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
