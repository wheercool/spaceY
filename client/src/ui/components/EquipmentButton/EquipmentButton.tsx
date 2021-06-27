import * as React from 'react';
import style from './EquipmentButton.css';

import { EquipmentButtonModel } from '../../../stores/SpaceshipPanelStore/EquipmentButtonModel';
import { observer } from 'mobx-react';
import classNames from 'classnames';

interface EquipmentButton {
  model: EquipmentButtonModel;
}

export const EquipmentButton: React.FC<EquipmentButton> = observer((
  {
    model
  }
) => {
  return <div className={classNames(style.equipmentButton, { [style.activeEquipmentButton]: model.active})}>
    <h3 className={style.title}>{model.title}</h3>
    <div className={style.body}>
      <div className={style.wrapper}>
        <div className={style.imageWrapper}>
          <img src={model.image} alt={model.title}/>
        </div>
      </div>
      <p className={style.buttonKey}>{model.button}</p>
      <div className={style.cooldownOverlay} style={{height: `${model.cooldownPercent}%`}}/>
    </div>

  </div>
});
