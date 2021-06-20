import * as React from 'react';
import upgrade from '../../../../public/assets/images/upgrade.svg';
import style from './UpgradeButton.css';

interface Button {
  onClick(): void;

  disabled?: boolean;
}

export const UpgradeButton: React.FC<Button> = (
  {
    onClick,
    disabled = false
  }) => {
  return <button disabled={disabled}
                 className={style.button}
                 onClick={onClick}>
    <img src={upgrade} alt=""/>
  </button>
};
