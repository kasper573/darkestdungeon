import * as React from "react";
import {Popup, PopupProps} from "./Popups";
import {LineButton} from "./LineButton";
import {AppState} from "./AppState";
import {PopupState} from "./PopupState";

export class PauseMenu extends React.Component<
  PopupProps & {
  state: AppState,
  mainMenu?: boolean
}> {
  static defaultProps = {
    mainMenu: true
  };

  render () {
    const {state, mainMenu, ...rest} = this.props; // Single out Popup props
    const router = this.props.state.router;
    const popups = this.props.state.popups;
    const options = this.props.state.options;

    const mainMenuButton = mainMenu && (
      <LineButton label="Return to Main Menu" onClick={() => router.goto("start")}/>
    );

    return (
      <Popup {...rest}>
        <LineButton label="Controls" onClick={() => popups.show(<Popup>Controls</Popup>)}/>
        <LineButton label="Credits" onClick={() => popups.show(<Popup>Credits</Popup>)}/>
        <LineButton label="Glossary" onClick={() => popups.show(<Popup>Glossary</Popup>)}/>
        <LineButton label="Help" onClick={() => popups.show(<Popup>Help</Popup>)}/>
        <LineButton
          label="Options"
          onClick={() => popups.show(
            <OptionList popups={popups} options={options}/>)
          }
        />
        {mainMenuButton}
      </Popup>
    );
  }
}

class OptionList extends React.Component<
  PopupProps & {
  popups: PopupState,
  options: any
}> {
  render () {
    const {options, popups, ...rest} = this.props; // Single out Popup props

    const optionButtons = [];
    for (const categoryName in options) {
      optionButtons.push(
        <LineButton
          key={categoryName}
          label={categoryName}
          onClick={() =>
            popups.show(
              <OptionEditor options={options[categoryName]}/>
            )
          }
        />
      );
    }

    return (
      <Popup {...rest}>
        {optionButtons}
      </Popup>
    );
  }
}

class OptionEditor extends React.Component<
  PopupProps & {
  options: any
}> {
  render () {
    const {options, ...rest} = this.props; // Single out Popup props

    return (
      <Popup {...rest}>
        <pre>
          {JSON.stringify(options, null, 2)}
        </pre>
      </Popup>
    );
  }
}
