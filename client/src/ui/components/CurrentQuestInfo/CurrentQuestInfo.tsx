import * as React from 'react';
import { useStore } from '../../../stores/store';
import style from './CurrentQuestInfo.css';
import { observer } from 'mobx-react';

export const CurrentQuestInfo = observer(() => {
  const questStore = useStore('Quest');
  return questStore.currentGoals.length > 0
    ? (<div className={style.currentQuest}>
      <div className={style.header}>Quest</div>
      <div className={style.body}>
        {questStore.currentGoals.map((goal, index) => <div key={index}>{goal}</div>)}
      </div>
    </div>)
    : null
})