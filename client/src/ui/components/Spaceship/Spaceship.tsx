import * as React from 'react';
import { SpaceshipName } from '../../../types';
import rabbit from '/public/assets/images/rabbit.png';
import storm from '/public/assets/images/storm.png';
import valkiria from '/public/assets/images/valkiria.png';
import lockedSrc from '/public/assets/images/locked.svg';

import style from './Spaceship.css';

interface Spaceship {
  name: SpaceshipName;
  locked?: boolean;
}

const images = {
  [SpaceshipName.Rabbit]: rabbit,
  [SpaceshipName.Storm]: storm,
  [SpaceshipName.Valkiria]: valkiria,
}
export const Spaceship: React.FC<Spaceship> = (
  {
    name,
    locked = false
  }
) => {
  const src = images[name];
  return <div className={style.wrapper}>
    <img className={style.img} src={src} alt={name}/>
    {locked && <img className={style.locked} src={lockedSrc} alt="locked"/>}
  </div>
}
