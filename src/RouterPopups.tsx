import * as React from "react";
import {Popup} from "./ui/Popups";
import {PopupAlign, PopupHandle, PopupState} from "./state/PopupState";
import {RouterState} from "./state/RouterState";
import {IReactionDisposer, reaction} from "mobx";
import {Route} from "./state/types/Route";
import {Path} from "./state/types/Path";

export class RouterPopups extends React.Component<{
  router: RouterState,
  popups: PopupState
}> {
  private disposeReaction: IReactionDisposer;
  private popup: PopupHandle;

  componentWillMount () {
    this.disposeReaction = reaction(
      () => [
        this.props.router.path,
        this.props.router.route
      ],
      ([path, route]: [Path, Route]) => {
        if (path.parts.length > 1) {
          this.showPopup(route);
        } else if (this.popup) {
          this.popup.close();
          delete this.popup;
        }
      }
    );
  }

  componentWillUnmount () {
    this.disposeReaction();
  }

  showPopup (route: Route) {
    this.popup = this.props.popups.show({
      align: PopupAlign.TopLeft,
      position: {x: 25, y: 25},
      id: "routePopup",
      onClose: () => this.props.router.goto(route.path.root),
      content: (
        <Popup padding={false}>
          {React.createElement(route.component, {path: route.path})}
        </Popup>
      )
    });
  }

  render (): null {
    return null;
  }
}
