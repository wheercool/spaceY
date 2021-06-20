import * as React from 'react';
import { Fact, SpaceshipFacts } from '../../../types';

import style from './SpaceshipInfoItem.css'

interface SpaceshipInfo {
  info: SpaceshipFacts;
}

interface SpaceshipInfoItem {
  fact: Fact;
}

const SpaceshipInfoItem: React.FC<SpaceshipInfoItem> = (
  { fact }
) => {
  return <div className={style.spaceshipFact}>
    <div className={style.factName}>{fact.name}</div>
    <div className={style.factValue}>{fact.value}</div>
  </div>;
}

export const SpaceshipInfo: React.FC<SpaceshipInfo> = (
  {
    info
  }
) => {
  return <div className={style.spaceshipFacts}>{info.map(fact => <SpaceshipInfoItem key={fact.name} fact={fact}/>)}</div>
}
