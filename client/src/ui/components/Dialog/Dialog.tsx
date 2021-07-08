import * as React from 'react';
import { observer } from 'mobx-react';

import style from './Dialog.css';
import { Button } from '../Button/Button';
import classNames from 'classnames';
import { useStore } from '../../../stores/store';
import { DialogStyle } from '../../../stores/DialogStore';

export const Dialog = observer(() => {
  const dialogStore = useStore('ModalDialogConsumer');

  const dialogStyle = classNames(style.dialog, {
    [style.dangerous]: dialogStore.style === DialogStyle.Dangerous,
    [style.successful]: dialogStore.style === DialogStyle.Successful
  })
  return dialogStore.visible ? (
      <div className={style.overlay}>
        <div className={dialogStyle}>
          <div className={style.header}>
            {dialogStore.title}
          </div>
          <div className={style.body}>
            {dialogStore.body}
          </div>
          <div className={style.footer}>
            <Button onClick={dialogStore.resolve} small fixed>OK</Button>
          </div>
        </div>
      </div>)
    : null;
})