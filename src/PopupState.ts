import {ReactElement} from "react";
import {observable} from "mobx";
import {Point} from "./Bounds";

export type PopupId = number;
export type PopupContent<P = {}> = ReactElement<P> | string;

export class PopupState {
  @observable map = new Map<PopupId, PopupHandle>();

  show <P> (
    content: PopupContent<P>,
    align?: PopupAlign,
    position?: Point,
    modalState?: ModalState,
    animate?: boolean
  ): PopupHandle<P> {
    const popup = new PopupHandle<P>(content, align, position, modalState, animate, this);
    this.map.set(popup.id, popup);
    return popup;
  }

  close (id: PopupId) {
    this.map.delete(id);
  }

  closeAll () {
    this.map.clear();
  }
}

let idCounter = 0;
export class PopupHandle<P = {}> {
  public id: PopupId;
  @observable public position?: Point;

  constructor (
    public content: PopupContent<P>,
    public align: PopupAlign = PopupAlign.Center,
    position: Point,
    public modalState: ModalState = ModalState.Opaque,
    public animate: boolean = true,
    private state: PopupState,
  ) {
    this.id = idCounter++;
    this.position = position;
  }

  reposition (position: Point) {
    this.position = position;
  }

  close () {
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
