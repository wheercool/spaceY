import * as React from 'react';
import { QuestRequirement } from '../../../types';
import checked from '/public/assets/images/checkbox_checked.svg';
import unchecked from '/public/assets/images/checkbox_unchecked.svg';
import style from './QuestRequirements.css';

interface QuestRequirements {
  requirements: QuestRequirement[];
}

interface QuestRequirementsItem {
  requirement: QuestRequirement;
}

export const QuestRequirementsItem: React.FC<QuestRequirementsItem> = (
  {
    requirement
  }) => {
  return <div className={style.requirement}>
    <div className={style.requirementName}>{requirement.name}</div>
    {
      requirement.met
       ? <img className={style.requirementMet} src={checked}/>
       : <img className={style.requirementMet} src={unchecked}/>
    }
  </div>
}

export const QuestRequirements: React.FC<QuestRequirements> = (
  {
    requirements
  }
) => {
  return <div className={style.requirements}>
    <h2 className={style.header}>Requirements:</h2>
    {requirements.map(requirement => <QuestRequirementsItem key={requirement.name} requirement={requirement}/>)}
  </div>
}


