import * as React from "react";
import {ReactElement} from "react";
import {observable, reaction} from "mobx";
import {Point} from "./Bounds";

export type PopupId = number;
export type PopupContent<P = {}> = ReactElement<P> | string;

type PopupProps<P> = {
  content: PopupContent<P>,
  align?: PopupAlign,
  position?: Point,
  modalState?: ModalState,
  animate?: boolean
};

type PopupPropsOrContent<P> = PopupProps<P> | PopupContent<P>;

function ensurePopupProps<P> (arg: PopupPropsOrContent<P>): PopupProps<P> {
  if (typeof arg === "string" || React.isValidElement(arg)) {
    return {content: arg};
  }
  return arg;
}

export class PopupState {
  @observable map = new Map<PopupId, PopupHandle>();

  show <P> (arg: PopupPropsOrContent<P>): PopupHandle<P> {
    const popup = new PopupHandle<P>(ensurePopupProps(arg), this);
    this.map.set(popup.id, popup);
    return popup;
  }

  prompt <P> (arg: PopupPropsOrContent<P>) {
    return new Promise ((resolve) => {
      const props = ensurePopupProps(arg);
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
    this.map.delete(id);
  }

  closeAll () {
    this.map.clear();
  }
}

let idCounter = 0;
export class PopupHandle<P = {}> implements PopupProps<P> {
  public id: PopupId;
  public content: PopupContent<P>;
  public align: PopupAlign = PopupAlign.Center;
  public modalState: ModalState = ModalState.ModalDismiss;
  public animate: boolean = true;
  public resolution: any;

  @observable public position?: Point;

  constructor (
    props: PopupProps<P>,
    private state: PopupState,
  ) {
    for (const key in props) {
      (this as any)[key] = (props as any)[key];
    }
    this.id = idCounter++;
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
