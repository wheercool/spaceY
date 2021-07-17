import * as React from 'react';
import { useStore } from '../../../stores/store';
import style from './CurrentQuestInfo.css';
import { observer } from 'mobx-react';

export const CurrentQuestInfo = observer(() => {
  const questStore = useStore('Quest');
  const currentQuestInfo = questStore.currentQuestInfo;
  return currentQuestInfo
    ? (<div className={style.currentQuest}>
      <div className={style.header}>{currentQuestInfo.title}</div>
      <div className={style.body}>
        {currentQuestInfo.hint}
      </div>
      <div className={style.footer}>
        {currentQuestInfo.goal}
      </div>
    </div>)
    : null
})