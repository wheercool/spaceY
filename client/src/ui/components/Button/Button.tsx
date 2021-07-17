import * as React from 'react';
import style from './Button.css';
import classNames from 'classnames';
import { useCallback } from 'react';
import { soundManager } from '../../../services/SoundManager';

interface Button {
  onClick(): void;
  play?: string;

  fixed?: boolean;
  small?: boolean;
  disabled?: boolean;
}

export const Button: React.FC<Button> = (
  {
    onClick,
    fixed,
    small,
    play = 'button',
    disabled = false,
    children
  }) => {
  const click = useCallback(() => {
    soundManager.play(play);
    onClick();
  }, [onClick, play])
  return <button className={classNames(style.button, { [style.buttonFixed]: !!fixed, [style.buttonSmall]: !!small })}
                 onClick={click}
                 disabled={disabled}
  >{children}</button>
}
