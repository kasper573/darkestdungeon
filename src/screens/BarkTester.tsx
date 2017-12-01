import * as React from "react";
import {observer} from "mobx-react";
import {AppStateComponent} from "../AppStateComponent";
import {BarkTooltip} from "../ui/BarkTooltip";
import {randomizeItem} from "../lib/Helpers";

@observer
export class BarkTester extends AppStateComponent {
  private barkBubble: BarkTooltip;

  playRandomBark () {
    this.barkBubble.bark(randomizeItem(this.appState.barker.barks));
  }

  render () {
    return (
      <div>
        <button onClick={() => this.playRandomBark()}>
          Play bark
        </button>
        <BarkTooltip ref={(b: BarkTooltip) => this.barkBubble = b}/>
      </div>
    );
  }
}
