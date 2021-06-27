import * as React from 'react';
import { QuestDescription } from '../../../stores/Quest';

interface Props {
  description: QuestDescription;
}

export const FirstQuest = () => {
  return <div>`You need to find a secret planet. Nobody knows where it is, but our elders told it looks like...`</div>
}

export const SecondQuest = () => {
 return <div><b>Hello, this is a second quest</b></div>
}


export const QuestsDescription: React.FC<Props> = (
  {
    description
  }) => {
  switch (description) {
    case QuestDescription.FirstQuest:
      return <FirstQuest/>;
    case QuestDescription.SecondQuest:
      return <SecondQuest/>;
  }
  return <></>;
};
