import * as React from "react";
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
import {AppStateComponent} from "./AppStateComponent";

export class EstateOverview extends AppStateComponent<{path: Path}> {
  componentWillMount () {
    this.appState.ambience.activate("estateOverview");

    // Show estate event popup if there's a new event pending
    const estateEvent = this.appState.profiles.activeProfile.estateEvent;
    if (!estateEvent.shown) {
      estateEvent.shown = true;
      this.appState.popups.show(<EstateEventPopup event={estateEvent}/>);
    }
  }

  gotoBuilding (component: any) {
    this.appState.ambience.activate(component.type.id);
    this.appState.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 25, y: 25},
      group: "building",
      content: <Popup padding={false}>{component}</Popup>,
      onClose: () => this.appState.ambience.activate("estateOverview")
    });
  }

  render () {
    return (
      <EstateTemplate
        path={this.props.path}
        continueLabel="Embark"
        continuePath="estateDungeons">
        <span onClick={() => this.gotoBuilding(<StageCoach />)}>[STAGE COACH]</span>
        <span onClick={() => this.gotoBuilding(<Graveyard />)}>[GRAVEYARD]</span>
        <span onClick={() => this.gotoBuilding(<Tavern />)}>[TAVERN]</span>
        <span onClick={() => this.gotoBuilding(<Sanitarium />)}>[SANITARIUM]</span>
        <span onClick={() => this.gotoBuilding(<Abbey />)}>[ABBEY]</span>
        <span onClick={() => this.gotoBuilding(<Guild />)}>[GUILD]</span>
        <span onClick={() => this.gotoBuilding(<Blacksmith />)}>[BLACKSMITH]</span>
        <span onClick={() => this.gotoBuilding(<Memoirs />)}>[MEMOIRS]</span>
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
