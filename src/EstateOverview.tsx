import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {EstateEvent} from "./ProfileState";
import {Popup, PopupProps} from "./Popups";
import {StageCoach} from "./StageCoach";
import {Graveyard} from "./Graveyard";
import {Tavern} from "./Tavern";
import {Sanitarium} from "./Sanitarium";
import {Abbey} from "./Abbey";
import {Blacksmith} from "./Blacksmith";
import {Guild} from "./Guild";
import {Memoirs} from "./Memoirs";
import {AppStateComponent} from "./AppStateComponent";

const buildings = [
  StageCoach,
  Graveyard,
  Tavern,
  Sanitarium,
  Abbey,
  Guild,
  Blacksmith,
  Memoirs
];

function getBuildingId (component: any) {
  return component.prototype.constructor.name;
}

export class EstateOverview extends AppStateComponent<{path: Path}> {
  componentWillMount () {
    // Show estate event popup if there's a new event pending
    const estateEvent = this.appState.profiles.activeProfile.estateEvent;
    if (!estateEvent.shown) {
      estateEvent.shown = true;
      this.appState.popups.show(<EstateEventPopup event={estateEvent}/>);
    }
  }

  gotoBuilding (component: any) {
    this.appState.router.goto("estateOverview/" + getBuildingId(component));
  }

  render () {
    return (
      <EstateTemplate
        path={this.props.path}
        continueLabel="Embark"
        continuePath="estateDungeons">
        {buildings.map((component: any) => (
          <span
            key={getBuildingId(component)}
            onClick={() => this.gotoBuilding(component)}>
            [{getBuildingId(component)}]
          </span>
        ))}
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
