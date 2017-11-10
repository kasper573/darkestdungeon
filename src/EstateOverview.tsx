import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {EstateEvent} from "./ProfileData";
import {Popup, PopupProps} from "./Popups";

export class EstateOverview extends React.Component<{state: AppState, path: Path}> {
  componentWillMount () {
    // Show estate event popup if there's a new event pending
    const estateEvent = this.props.state.profiles.activeProfile.estateEvent;
    if (!estateEvent.shown) {
      estateEvent.shown = true;
      this.props.state.popups.show(<EstateEventPopup event={estateEvent}/>);
    }
  }

  render () {
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        continueLabel="Embark"
        continuePath="estateDungeons">
        Estate overview
      </EstateTemplate>
    );
  }
}

class EstateEventPopup extends React.Component<
  PopupProps & {
  event: EstateEvent
}> {
  render () {
    const {event, ...rest} = this.props;
    return (
      <Popup {...rest}>
        Estate Event: {event.message}
      </Popup>
    );
  }
}
