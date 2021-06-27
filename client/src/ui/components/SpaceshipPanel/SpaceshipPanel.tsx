import { observer } from 'mobx-react';
import * as React from 'react';
import { useStore } from 'src/stores/store';
import style from './SpaceshipPanel.css';
import panelImg from '/public/assets/images/panel2.svg';
import { EquipmentButton } from '../EquipmentButton/EquipmentButton';
import { SpaceshipCard } from '../SpaceshipCard/SpaceshipCard';


export const SpaceshipPanel: React.FC = observer(() => {
  const spaceshipPanel = useStore('SpaceshipPanel');

  return <div className={style.spaceshipPanel}>
    <img src={panelImg} alt="spaceship panel"/>
    <div className={style.equipmentButtons}>
      {spaceshipPanel.gravityGun.exist && <div className={style.btnWrapper}><EquipmentButton model={spaceshipPanel.gravityGun}/></div>}
      {spaceshipPanel.turret.exist && <div className={style.btnWrapper}><EquipmentButton model={spaceshipPanel.turret}/></div>}
      {spaceshipPanel.shield.exist && <div className={style.btnWrapper}><EquipmentButton model={spaceshipPanel.shield}/></div>}
      {spaceshipPanel.rockets.exist && <div className={style.btnWrapper}><EquipmentButton model={spaceshipPanel.rockets}/></div>}
    </div>
    <div className={style.spaceshipContainer}>
      <SpaceshipCard/>
    </div>
  </div>
});
