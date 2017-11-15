import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "./RouterState";
import {EstateEvent} from "./ProfileState";
import {Popup, PopupProps} from "./Popups";
import {PopupAlign, PopupHandle} from "./PopupState";
import {StageCoach} from "./StageCoach";
import {Graveyard} from "./Graveyard";
import {Tavern} from "./Tavern";
import {Sanitarium} from "./Sanitarium";
import {Abbey} from "./Abbey";
import {Blacksmith} from "./Blacksmith";
import {Guild} from "./Guild";
import {Memoirs} from "./Memoirs";
import {AppStateComponent} from "./AppStateComponent";
import {IReactionDisposer, reaction} from "mobx";

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

const buildingLookup = buildings.reduce(
  (lookup, component) => {
    lookup[getBuildingId(component)] = component;
    return lookup;
  }, {} as {[key: string]: any}
);

function getBuildingId (component: any) {
  return component.prototype.constructor.name;
}

export class EstateOverview extends AppStateComponent<{path: Path}> {
  private disposeReaction: IReactionDisposer;
  private buildingPopup: PopupHandle;

  componentWillMount () {
    // Show estate event popup if there's a new event pending
    const estateEvent = this.appState.profiles.activeProfile.estateEvent;
    if (!estateEvent.shown) {
      estateEvent.shown = true;
      this.appState.popups.show(<EstateEventPopup event={estateEvent}/>);
    }

    this.disposeReaction = reaction(
      () => this.appState.router.path,
      (path: Path) => {
        if (path.args.building) {
          this.showBuilding(buildingLookup[path.args.building]);
        } else if (this.buildingPopup) {
          this.buildingPopup.close();
          delete this.buildingPopup;
        }
      }
    );
  }

  componentWillUnmount () {
    this.disposeReaction();
  }

  gotoBuilding (component: any) {
    this.appState.router.goto(
      new Path("estateOverview", {
        building: getBuildingId(component)
      })
    );
  }

  showBuilding (component: any) {
    this.buildingPopup = this.appState.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 25, y: 25},
      id: "building",
      onClose: () => this.appState.router.goto("estateOverview"),
      content: (
        <Popup padding={false}>
          {React.createElement(component)}
        </Popup>
      )
    });
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
