import * as React from 'react';
import { SpaceshipName } from '../../../types';
import rabbit from '/public/assets/images/rabbit.png';
import storm from '/public/assets/images/storm.png';
import valkiria from '/public/assets/images/valkiria.png';
import inUseSrc from '/public/assets/images/active.svg';

import style from './Spaceship.css';
import { observer } from 'mobx-react';
import { useStore } from 'src/stores/store';

interface Spaceship {
  name: SpaceshipName;
  locked?: boolean;
}

const images = {
  [SpaceshipName.Rabbit]: rabbit,
  [SpaceshipName.Storm]: storm,
  [SpaceshipName.Valkiria]: valkiria,
}
export const Spaceship: React.FC<Spaceship> = observer((
  {
    name,
    locked = false
  }
) => {
  const dock = useStore('Dock');
  const src = images[name];
  return <div className={style.wrapper}>
    <img className={style.img} src={src} alt={name}/>
    {dock.isCurrentSpaceshipInUse && <img className={style.active} src={inUseSrc} alt="active"/>}
  </div>
})
