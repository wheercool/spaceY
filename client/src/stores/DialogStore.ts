import { action, makeObservable, observable } from 'mobx';

export enum DialogStyle {
  Neutral,
  Dangerous,
  Successful
}

export interface ModalDialog {
  show(title: string, text: string, style?: DialogStyle): Promise<void>;
}

export interface ModalDialogConsumer {
  title: string;
  body: string;
  style: DialogStyle;
  visible: boolean;
  resolve(): void;
}

export class DialogStore implements ModalDialog, ModalDialogConsumer {
  @observable title = '';
  @observable body = '';
  @observable style = DialogStyle.Neutral;
  @observable visible = false;
  private resolver: (value: (PromiseLike<void> | void)) => void = noop;

  constructor() {
    makeObservable(this);
  }

  @action.bound show(title: string, text: string, style: DialogStyle): Promise<void> {
    return new Promise((resolve) => {
      this.title = title;
      this.body = text;
      this.style = style;
      this.resolver = resolve;
      this.visible = true;
    })
  }

  @action.bound resolve() {
    this.resolver();
    this.visible = false;
  }
}

function noop() {
}