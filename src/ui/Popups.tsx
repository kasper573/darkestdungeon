import * as React from "react";
import {ModalState, PopupHandle} from "../state/PopupState";
import {css, StyleSheet} from "aphrodite";
import {LineButton} from "./LineButton";
import {grid} from "../config/Grid";
import {Input} from "../config/Input";
import {InputBinding} from "../state/InputState";
import {commonColors, commonStyleFn} from "../config/styles";
import {Icon} from "./Icon";
import {VerticalOutlineBox} from "./VerticalOutlineBox";
import Color = require("color");

export type PopupProps = {
  headerIcon?: string,
  handle?: PopupHandle,
  closeable?: boolean,
  classStyle?: any
};

export class Popup extends React.Component<PopupProps> {
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

    const headerIcon = this.props.headerIcon && (
      <div className={css(styles.header)}>
        <div className={css(styles.headerInner)}>
          <VerticalOutlineBox/>
          <Icon src={this.props.headerIcon} scale={headerIconScale}/>
        </div>
      </div>
    );

    return (
      <div className={css(styles.popup, this.props.classStyle)}>
        <div className={css(styles.splash)}/>
        <div className={css(styles.content)}>
          {headerIcon}
          {this.props.children}
          {closeButton}
        </div>
      </div>
    );
  }
}

const promptIcon = require("../../assets/dd/images/modes/base/fe_flow/mode_select_dialog_icon.png");
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
    let {query, responses, classStyle, ...rest} = this.props;
    if (!responses) {
      responses = this.getDefaultResponses();
    }

    return (
      <Popup headerIcon={promptIcon} classStyle={[styles.prompt, classStyle]} {...rest}>
        {query && (
          <div className={css(styles.promptQuery)}>
            {query}
          </div>
        )}

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

const headerIconScale = 2;
const splashSize = grid.ySpan(2);
export const popupBorder1Size = grid.gutter / 2;
export const popupBorder2Size = grid.border;
export const popupContentPadding = grid.gutter;
export const popupOffset = popupBorder1Size + popupBorder2Size + popupContentPadding;
const styles = StyleSheet.create({
  popup: {
    background: "black",
    padding: popupBorder1Size,
    boxShadow: commonStyleFn.outerShadow(),
    minWidth: grid.vw(25),
    maxWidth: grid.vw(85)
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
    border: commonStyleFn.border(commonColors.gold, popupBorder2Size),
    boxShadow: commonStyleFn.innerShadow(undefined, grid.gutter * 4),
    padding: popupContentPadding
  },

  header: {
    marginBottom: popupContentPadding,
    background: commonStyleFn.gradient("bottom", [
      [0, new Color(commonColors.gold).darken(1)],
      [20, new Color(commonColors.gold).darken(0.85)],
      [50, new Color(commonColors.gold).darken(0.85)],
      [100, new Color(commonColors.gold).darken(1)]
    ]),

    ":before": {
      ...commonStyleFn.dock(),
      content: '" "',
      background: commonStyleFn.gradient("right", [
        [0, "black"],
        [50, "transparent"],
        [100, "black"]
      ])
    }
  },

  headerInner: {
    marginLeft: "25%",
    marginRight: "25%",
    alignItems: "center"
  },

  closeButton: {
    ...commonStyleFn.dock("topRight", popupContentPadding)
  },

  prompt: {
    maxWidth: grid.vw(33)
  },

  promptQuery: {
    fontWeight: "bold",
    marginBottom: grid.gutter * 2,
    textAlign: "center",
    whiteSpace: "pre-wrap"
  },

  promptButton: {
    ":not(:last-child)": {
      marginBottom: grid.gutter
    }
  }
});
