import * as React from 'react';
import style from './Button.css';
import classNames from 'classnames';

interface Button {
  onClick(): void;

  fixed?: boolean;
  small?: boolean;
}

export const Button: React.FC<Button> = (
  {
    onClick,
    fixed,
    small,
    children
  }) => {
  return <button className={classNames(style.button, { [style.buttonFixed]: !!fixed, [style.buttonSmall]: !!small })}>{children}</button>
}