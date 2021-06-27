import * as React from 'react';
import style from './SpaceshipPanel.css';
import panelImg  from '/public/assets/images/panel2.svg';


export const SpaceshipPanel: React.FC = () => {
 return <div className={style.spaceshipPanel}>
  <img src={panelImg} alt="spaceship panel"/>
 </div>
};
