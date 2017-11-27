import * as React from "react";
import {ModalState, PopupHandle} from "../state/PopupState";
import {css, StyleSheet} from "aphrodite";
import {LineButton} from "./LineButton";
import {BannerHeader} from "./BannerHeader";
import {grid} from "../config/Grid";
import {Input} from "../config/Input";
import {InputBinding} from "../state/InputState";
import {commonColors, commonStyleFn} from "../config/styles";
import {Icon} from "./Icon";

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
      <Icon
        src={require("../../assets/dd/images/shared/progression/progression_close.png")}
        size={grid.gutter * 3}
        classStyle={styles.closeButton}
        onClick={() => this.props.handle.close()}>
        <InputBinding
          match={Input.back}
          callback={() => this.props.handle.close()}
        />
      </Icon>
    );

    const dynamicStyle = !this.props.padding ? {
      padding: 0
    } : undefined;

    return (
      <div className={css(styles.popup)} style={dynamicStyle}>
        <div className={css(styles.splash)}/>
        <div className={css(styles.content)}>
          {closeButton}
          {this.props.children}
        </div>
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
        responses={[{label: dismissLabel, value: dismissValue}]}>
        {this.props.children}
      </Prompt>
    );
  }
}

type PromptResponse = {
  label: string,
  value: any
};

const splashSize = grid.ySpan(2);
export const popupPadding = grid.gutter / 2;
const styles = StyleSheet.create({
  popup: {
    background: "black",
    padding: popupPadding,
    boxShadow: commonStyleFn.outerShadow(),
    minWidth: grid.vw(25),
    maxWidth: grid.vw(75)
  },

  splash: {
    ...commonStyleFn.dock("topRight", -splashSize / 2),
    width: splashSize,
    height: splashSize,
    background: `url(${require("../../assets/images/splash1.png")})`,
    backgroundSize: "contain",
    backgroundPosition: "50% 50%",
    backgroundRepeat: "no-repeat"
  },

  content: {
    flex: 1,
    border: commonStyleFn.border(commonColors.gold),
    boxShadow: commonStyleFn.innerShadow(undefined, grid.gutter * 4),
    padding: popupPadding
  },

  closeButton: {
    ...commonStyleFn.dock("topRight", popupPadding),
    zIndex: 1
  },

  promptButton: {
    ":not(:last-child)": {
      marginBottom: grid.gutter
    }
  }
});
