import * as React from 'react';

import style from './Loader.css';

interface Loader {
  percent: number;
}

export const Loader: React.FC<Loader> = (
  { percent }
) => {
  return <div className={style.loader}>
      <h3 className={style.title}>Loading...</h3>
      <div className={style.progressContainer}>
        <div className={style.progressValue} style={{width: `${percent}%`}}/>
      </div>
  </div>
}
