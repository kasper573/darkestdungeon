import * as React from "react";
import * as PropTypes from "prop-types";
import uuid = require("uuid");

export type InputBindingId = string;
export type InputHandlerContext = {inputHandler: InputHandler};
export type InputBindingProps = {
  match: string,
  onTrigger: (e: KeyboardEvent) => void;
};

export class InputHandler {
  bindings = new Map<InputBindingId, InputBinding>();

  startListening () {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.onKeyDown.bind(this));
    }
  }

  stopListening () {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.onKeyDown.bind(this));
    }
  }

  onKeyDown (e: KeyboardEvent) {
    for (const binding of this.bindings.values()) {
      if (e.key.toLowerCase() === binding.props.match.toLowerCase()) {
        binding.props.onTrigger(e);
      }
    }
  }
}

export const inputHandlerContext = {
  inputHandler: PropTypes.instanceOf(InputHandler)
};

export class InputRoot extends React.Component<any> {
  static childContextTypes = inputHandlerContext;
  private domNode: HTMLDivElement;
  private inputHandler = new InputHandler();

  getChildContext (): InputHandlerContext {
    return {
      inputHandler: this.inputHandler
    };
  }

  componentWillMount () {
    this.inputHandler.startListening();
  }

  componentWillUnmount () {
    this.inputHandler.stopListening();
  }

  render () {
    return (
      <div ref={(node) => this.domNode = node} {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export class InputBindings extends React.Component<{list: InputBindingProps[]}> {
  render () {
    return this.props.list.map((props, index) => (
      <InputBinding key={index} {...props} />
    ));
  }
}

export class InputBinding extends React.Component<InputBindingProps> {
  static contextTypes = inputHandlerContext;
  context: InputHandlerContext;
  id: InputBindingId = uuid();

  componentWillMount () {
    this.context.inputHandler.bindings.set(this.id, this);
  }

  componentWillUpdate () {
    this.context.inputHandler.bindings.set(this.id, this);
  }

  componentWillUnmount () {
    this.context.inputHandler.bindings.delete(this.id);
  }

  render (): null {
    return null;
  }
}
