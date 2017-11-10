import * as React from "react";
import {ModalState, PopupHandle} from "./PopupState";
import {css, StyleSheet} from "aphrodite";
import {LineButton} from "./LineButton";
import {fonts} from "../assets/fonts";
import {BannerHeader} from "./BannerHeader";

export type PopupProps = {
  handle?: PopupHandle,
  closeable?: boolean
};

export class Popup extends React.Component<PopupProps> {
  render () {
    const isDismissable = this.props.handle.modalState !== ModalState.Modal;
    const hasCloseButton = this.props.closeable || isDismissable;
    const closeButton = hasCloseButton && (
      <span
        className={css(styles.popupCloseButton)}
        onClick={() => this.props.handle.close()}>
        X
      </span>
    );

    return (
      <div className={css(styles.popup)}>
        {this.props.children}
        {closeButton}
      </div>
    );
  }
}

export class Prompt extends React.Component<
  PopupProps & {
  query?: string,
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
            className={css(styles.promptButton)}
            onClick={() => this.props.handle.close(response.value)}
            label={response.label}/>
        ))}
      </Popup>
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
    padding: "2vw",
    boxShadow: "inset 0 0 10px #000000",
    border: "2px solid " + borderColor,
    minWidth: "25vw",
    maxWidth: "75vw",
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
      textShadow: "0px 0px 5px rgb(255, 255, 255)",
    }
  },

  promptButton: {
    marginBottom: 10,
    ":last-child": {
      marginBottom: 0
    }
  }
});
