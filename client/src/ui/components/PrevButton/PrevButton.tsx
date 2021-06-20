import * as React from 'react';
import next from '../../../../public/assets/images/next.svg';
import style from '../PrevButton/PrevButton.css';

interface Button {
  onClick(): void;

  disabled?: boolean;
}

export const PrevButton: React.FC<Button> = (
  {
    onClick,
    disabled = false
  }) => {
  return <button disabled={disabled}
                 className={style.button}
                 onClick={onClick}>
    <img src={next} alt=""/>
  </button>
}

