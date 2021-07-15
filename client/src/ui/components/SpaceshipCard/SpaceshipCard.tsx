import * as React from 'react';
import { observer } from 'mobx-react';

import style from './SpaceshipCard.css';
import { useStore } from 'src/stores/store';


export const SpaceshipCard = observer(() => {
  const spaceshipPanel = useStore('SpaceshipPanel');

  return <div className={style.spaceshipCard}>
    <div className={style.title}>{spaceshipPanel.spaceshipName}</div>
    <div className={style.body}>
      <div className={style.imageWrapper}>
        <img src={spaceshipPanel.spaceshipImage}/>
      </div>
    </div>
    <div className={style.footer}>

    </div>
  </div>
})
