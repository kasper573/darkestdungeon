import * as React from "react";
import {ModalState, PopupHandle} from "../state/PopupState";
import {css, StyleSheet} from "aphrodite";
import {LineButton} from "./LineButton";
import {fonts} from "../../assets/fonts";
import {BannerHeader} from "./BannerHeader";
import {grid} from "../config/Grid";
import {Input} from "../config/Input";
import {InputBinding} from "../state/InputState";

export type PopupProps = {
  handle?: PopupHandle,
  closeable?: boolean,
  padding?: boolean;
};

export class Popup extends React.Component<PopupProps> {
  static defaultProps = {
    padding: true
  };

  render () {
    const isDismissable = this.props.handle && this.props.handle.modalState !== ModalState.Modal;
    const hasCloseButton = this.props.handle && (this.props.closeable || isDismissable);
    const closeButton = hasCloseButton && (
      <span
        className={css(styles.popupCloseButton)}
        onClick={() => this.props.handle.close()}>
        X
        <InputBinding
          match={Input.back}
          callback={() => this.props.handle.close()}
        />
      </span>
    );

    const dynamicStyle = !this.props.padding ? {
      padding: 0
    } : undefined;

    return (
      <div className={css(styles.popup)} style={dynamicStyle}>
        {this.props.children}
        {closeButton}
      </div>
    );
  }
}

export class Prompt extends React.Component<
  PopupProps & {
  query?: any,
  responses?: PromptResponse[],
  yesLabel?: string,
  noLabel?: string
}> {
  static defaultProps = {
    yesLabel: "Yes",
    noLabel: "No"
  };

  getDefaultResponses () {
    return [
      {label: this.props.yesLabel, value: true},
      {label: this.props.noLabel, value: false}
    ];
  }
  render () {
    // noinspection TsLint
    let {query, responses, ...rest} = this.props;
    if (!responses) {
      responses = this.getDefaultResponses();
    }

    return (
      <Popup {...rest}>
        <BannerHeader>{query}</BannerHeader>
        {responses.map((response) => (
          <LineButton
            key={response.label}
            classStyle={styles.promptButton}
            onClick={() => this.props.handle.close(response.value)}
            label={response.label}/>
        ))}
      </Popup>
    );
  }
}

export class Alert extends React.Component<
  PopupProps & {
  message: any,
  dismissLabel?: string
  dismissValue?: any
}> {
  static defaultProps = {
    dismissLabel: "Ok",
    dismissValue: false
  };

  render () {
    const {message, dismissLabel, dismissValue, ...rest} = this.props;
    return (
      <Prompt {...rest}
        query={message}
        responses={[{label: dismissLabel, value: dismissValue}]}
      />
    );
  }
}

type PromptResponse = {
  label: string,
  value: any
};

const borderColor = "#333";
const closeButtonSize = 25;
const styles = StyleSheet.create({
  popup: {
    background: "linear-gradient(to bottom, #352813 0%,#0e0e0e 33%,#222222 100%)",
    padding: 10,
    boxShadow: "inset 0 0 10px #000000",
    border: "2px solid " + borderColor,
    minWidth: grid.vw(25),
    maxWidth: grid.vw(75),
    color: "#aaa"
  },

  popupCloseButton: {
    position: "absolute",
    top: -closeButtonSize / 2,
    right: -closeButtonSize / 2,
    width: closeButtonSize,
    height: closeButtonSize,

    fontFamily: fonts.Darkest,

    border: "2px solid " + borderColor,
    borderRadius: closeButtonSize / 2,
    backgroundColor: "rgba(38, 0, 0, 1)",
    boxShadow: "inset 0 0 10px #000000",
    color: "black",

    justifyContent: "center",
    alignItems: "center",

    textShadow: "0px 0px 5px rgb(210, 90, 90)",
    ":hover": {
      textShadow: "0px 0px 5px rgb(255, 255, 255)"
    }
  },

  promptButton: {
    marginBottom: 10,
    ":last-child": {
      marginBottom: 0
    }
  }
});
