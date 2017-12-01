import * as React from "react";
import {AppStateComponent} from "../AppStateComponent";
import {TooltipArea, TooltipAreaProps, TooltipSide} from "../lib/TooltipArea";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BarkSubscription} from "../state/BarkDistributor";
import {BarkTooltip} from "./BarkTooltip";

@observer
export class BarkTooltipArea extends AppStateComponent<TooltipAreaProps> {
  static defaultProps = {
    side: TooltipSide.Left
  };

  private barkState = observable(false);
  private barkTooltip: BarkTooltip;
  private subscription: BarkSubscription;

  componentDidMount () {
    this.subscription = this.appState.barker.subscribe(this.receiveBark.bind(this));
  }

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  receiveBark (bark: string) {
    return this.barkTooltip.bark(bark);
  }

  render () {
    return (
      <TooltipArea
        {...this.props}
        show={this.barkState.get()}
        tip={
          <BarkTooltip
            barkState={this.barkState}
            ref={(tooltip) => this.barkTooltip = tooltip}
          />
        }>
        {this.props.children}
      </TooltipArea>
    );
  }
}
