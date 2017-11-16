import * as React from "react";
import {ReactElement} from "react";
import {observable, reaction, transaction} from "mobx";
import {Point} from "../Bounds";
import uuid = require("uuid");

export type PopupId = string;
export type PopupContent<P = {}> = ReactElement<P> | string;

type PopupHandleProps<P> = {
  content: PopupContent<P>,
  align?: PopupAlign,
  position?: Point,
  modalState?: ModalState,
  animate?: boolean,
  id?: PopupId,
  onClose?: () => void
};

type PopupHandlePropsOrContent<P> = PopupHandleProps<P> | PopupContent<P>;

function ensureProps<P> (arg: PopupHandlePropsOrContent<P>): PopupHandleProps<P> {
  if (typeof arg === "string" || React.isValidElement(arg)) {
    return {content: arg};
  }
  return arg;
}

export class PopupState {
  @observable map = new Map<PopupId, PopupHandle>();

  show <P> (arg: PopupHandlePropsOrContent<P>): PopupHandle<P> {
    const popup = new PopupHandle<P>(ensureProps(arg), this);
    this.map.set(popup.id, popup);
    return popup;
  }

  prompt <P> (arg: PopupHandlePropsOrContent<P>) {
    return new Promise ((resolve) => {
      const props = ensureProps(arg);
      const popup = this.show({...props, modalState: ModalState.Modal});
      const disposeReaction = reaction(
        () => this.map.has(popup.id),
        (popupExists: boolean) => {
          if (!popupExists) {
            disposeReaction();
            resolve(popup.resolution);
          }
        }
      );
    });
  }

  close (id: PopupId) {
    const popup = this.map.get(id);
    if (popup) {
      this.map.delete(id);
      if (popup.onClose) {
        popup.onClose();
      }
    }
  }

  closeAll () {
    transaction(() => {
      const popupIds = Array.from(this.map.keys());
      for (const id of popupIds) {
        this.close(id);
      }
    });
  }
}

export class PopupHandle<P = {}> implements PopupHandleProps<P> {
  public id: PopupId = uuid();
  public content: PopupContent<P>;
  public align: PopupAlign = PopupAlign.Center;
  public modalState: ModalState = ModalState.ModalDismiss;
  public animate: boolean = true;
  public resolution: any;
  public onClose?: () => void;

  @observable public position?: Point;

  constructor (
    props: PopupHandleProps<P>,
    private state: PopupState,
  ) {
    for (const key in props) {
      (this as any)[key] = (props as any)[key];
    }
  }

  reposition (position: Point) {
    this.position = position;
  }

  close (resolution?: any) {
    this.resolution = resolution;
    this.state.close(this.id);
  }
}

export enum PopupAlign {
  Top,
  Right,
  Bottom,
  Left,
  Center,
  TopLeft
}

export enum ModalState {
  Opaque,
  Modal,
  ModalDismiss
}
