import * as React from "react";
import {EstateTemplate} from "./EstateTemplate";
import {Path} from "../../state/types/Path";
import {EstateEvent} from "../../state/types/EstateEvent";
import {Popup, PopupProps} from "../../ui/Popups";
import {AppStateComponent} from "../../AppStateComponent";
import {when} from "mobx";
import {Route} from "../../state/types/Route";
import {StaticState} from "../../state/StaticState";
import {grid} from "../../config/Grid";
import {css, StyleSheet} from "aphrodite";
import {Avatar} from "../../ui/Avatar";
import {TooltipArea, TooltipSide} from "../../lib/TooltipArea";
import {commonStyles} from "../../config/styles";

const sounds = {
  continueToMap: {src: require("../../../assets/dd/audio/ui_town_button_embark.wav"), volume: 0.7},
  showBuilding: {src: require("../../../assets/dd/audio/ui_town_char_rollover_03.wav"), volume: 1.5}
};

export class EstateOverview extends AppStateComponent<{
  path: Path,
  route: Route
}> {
  private stopWaitingForEstateEvents: () => void;

  componentWillMount () {
    // Show estate event when there is one
    this.stopWaitingForEstateEvents = when(() => !this.activeProfile.estateEvent.shown, () => {
      this.activeProfile.estateEvent.shown = true;
      this.appState.popups.show(<EstateEventPopup event={this.activeProfile.estateEvent}/>);
    });
  }

  componentWillUnmount () {
    this.stopWaitingForEstateEvents();
  }

  render () {
    return (
      <EstateTemplate
        path={this.props.path}
        background={require("../../../assets/dd/images/campaign/town/town_bg.png")}
        continueSound={sounds.continueToMap}
        continueLabel="Embark"
        continuePath="estateDungeons">
        <div className={css(styles.buildingIcons)}>
          {Object.keys(this.props.route.children).map((buildingKey) => {
            const buildingPath = this.props.path.value + Path.separator + buildingKey;
            const buildingRoute = this.props.route.children[buildingKey] as Route;
            const building = StaticState.instance.buildings.get(buildingRoute.component.id);
            return (
              <TooltipArea
                key={building.id}
                classStyle={styles.buildingIcon}
                side={TooltipSide.Right}
                tip={building.name}>
                <Avatar
                  classStyle={commonStyles.fill}
                  src={building.avatarUrl}
                  clickSound={sounds.showBuilding}
                  onClick={() => this.appState.router.goto(buildingPath)}
                />
              </TooltipArea>
            );
          })}
        </div>
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

const buildingIconSize = grid.ySpan(1);
const styles = StyleSheet.create({
  buildingIcons: {
    position: "absolute",
    top: grid.ySpan(3) + grid.gutter,
    left: -grid.xSpan(1) - grid.gutter,
    zIndex: 1
  },

  buildingIcon: {
    width: buildingIconSize,
    height: buildingIconSize,
    marginBottom: grid.gutter
  }
});
