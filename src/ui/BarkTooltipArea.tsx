import * as React from "react";
import {AppStateComponent} from "../AppStateComponent";
import {TooltipArea, TooltipAreaProps, TooltipSide} from "../lib/TooltipArea";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {BarkSubscription} from "../state/BarkDistributor";
import {BarkTooltip} from "./BarkTooltip";

@observer
export class BarkTooltipArea extends AppStateComponent<
  TooltipAreaProps & {
  subscribe?: boolean
}> {
  static defaultProps = {
    side: TooltipSide.Left,
    subscribe: true
  };

  @observable private barkText: string;
  private barkTooltip: BarkTooltip;
  private subscription: BarkSubscription;

  componentDidMount () {
    if (this.props.subscribe) {
      this.subscription = this.appState.barker.subscribe(this.receiveBark.bind(this));
    }
  }

  componentWillUnmount () {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  receiveBark (bark: string) {
    return this.barkText = bark;
  }

  render () {
    const {subscribe, ...rest} = this.props;
    return (
      <TooltipArea
        {...rest}
        show={!!this.barkText}
        wrap={false}
        tip={
          <BarkTooltip
            text={this.barkText}
            onFinished={() => this.barkText = null}
            ref={(tooltip) => this.barkTooltip = tooltip}
          />
        }>
        {this.props.children}
      </TooltipArea>
    );
  }
}
