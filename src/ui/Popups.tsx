import * as React from "react";
import {ModalState, PopupHandle} from "../state/PopupState";
import {css, StyleSheet} from "aphrodite";
import {LineButton} from "./LineButton";
import {fonts} from "../../assets/fonts";
import {BannerHeader} from "./BannerHeader";
import {grid} from "../config/Grid";
import {Input} from "../config/Input";
import {InputBinding} from "../state/InputState";
import {commonColors, commonStyleFn} from "../config/styles";

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
        {closeButton}
        {this.props.children}
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
        {query && <BannerHeader>{query}</BannerHeader>}
        {this.props.children}
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
      >
        {this.props.children}
      </Prompt>
    );
  }
}

type PromptResponse = {
  label: string,
  value: any
};

const closeButtonSize = grid.gutter * 3;
const styles = StyleSheet.create({
  popup: {
    background: "linear-gradient(to bottom, #352813 0%,#0e0e0e 33%,#222222 100%)",
    padding: grid.gutter,
    boxShadow: commonStyleFn.innerShadow(),
    border: commonStyleFn.border(),
    minWidth: grid.vw(25),
    maxWidth: grid.vw(75)
  },

  popupCloseButton: {
    position: "absolute",
    top: -closeButtonSize / 2,
    right: -closeButtonSize / 2,
    width: closeButtonSize,
    height: closeButtonSize,
    zIndex: 1,

    fontFamily: fonts.Darkest,

    border: commonStyleFn.border(),
    borderRadius: closeButtonSize / 2,
    backgroundColor: commonColors.bloodRed,
    boxShadow: commonStyleFn.innerShadow(),
    color: "black",

    justifyContent: "center",
    alignItems: "center",

    textShadow: commonStyleFn.textShadow(),
    ":hover": {
      textShadow: commonStyleFn.textShadow("white")
    }
  },

  promptButton: {
    ":not(:last-child)": {
      marginBottom: grid.gutter
    }
  }
});
