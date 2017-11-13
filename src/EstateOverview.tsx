import * as React from "react";
import {AppState} from "./AppState";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {EstateEvent} from "./ProfileState";
import {Popup, PopupProps} from "./Popups";
import {PopupAlign} from "./PopupState";
import {StageCoach} from "./StageCoach";
import {Graveyard} from "./Graveyard";
import {Tavern} from "./Tavern";
import {Sanitarium} from "./Sanitarium";
import {Abbey} from "./Abbey";
import {Blacksmith} from "./Blacksmith";
import {Guild} from "./Guild";
import {Memoirs} from "./Memoirs";

export class EstateOverview extends React.Component<{
  state: AppState,
  path: Path
}> {
  componentWillMount () {
    // Show estate event popup if there's a new event pending
    const estateEvent = this.props.state.profiles.activeProfile.estateEvent;
    if (!estateEvent.shown) {
      estateEvent.shown = true;
      this.props.state.popups.show(<EstateEventPopup event={estateEvent}/>);
    }
  }

  gotoBuilding (component: any) {
    this.props.state.ambience.activate(component.type.id);
    this.props.state.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 25, y: 25},
      group: "building",
      content: <Popup padding={false}>{component}</Popup>,
      onClose: () => this.props.state.ambience.activate("estate")
    });
  }

  render () {
    const popups = this.props.state.popups;
    return (
      <EstateTemplate
        state={this.props.state}
        path={this.props.path}
        continueLabel="Embark"
        continuePath="estateDungeons">
        <span onClick={() => this.gotoBuilding(<StageCoach popups={popups}/>)}>[STAGE COACH]</span>
        <span onClick={() => this.gotoBuilding(<Graveyard popups={popups}/>)}>[GRAVEYARD]</span>
        <span onClick={() => this.gotoBuilding(<Tavern popups={popups}/>)}>[TAVERN]</span>
        <span onClick={() => this.gotoBuilding(<Sanitarium popups={popups}/>)}>[SANITARIUM]</span>
        <span onClick={() => this.gotoBuilding(<Abbey popups={popups}/>)}>[ABBEY]</span>
        <span onClick={() => this.gotoBuilding(<Guild popups={popups}/>)}>[GUILD]</span>
        <span onClick={() => this.gotoBuilding(<Blacksmith popups={popups}/>)}>[BLACKSMITH]</span>
        <span onClick={() => this.gotoBuilding(<Memoirs popups={popups}/>)}>[MEMOIRS]</span>
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
