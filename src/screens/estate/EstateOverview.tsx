import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "../../state/RouterState";
import {EstateEvent} from "../../state/ProfileState";
import {Popup, PopupProps} from "../../ui/Popups";
import {StageCoach} from "./buildings/StageCoach";
import {Graveyard} from "./buildings/Graveyard";
import {Tavern} from "./buildings/Tavern";
import {Sanitarium} from "./buildings/Sanitarium";
import {Abbey} from "./buildings/Abbey";
import {Blacksmith} from "./buildings/Blacksmith";
import {Guild} from "./buildings/Guild";
import {Memoirs} from "./buildings/Memoirs";
import {AppStateComponent} from "../../AppStateComponent";

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
