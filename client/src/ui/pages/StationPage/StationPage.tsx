import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './StationPage.css';
import { Page } from '../Page';
import { Card } from '../../components/Card/Card';
import dockImage from '/public/assets/images/dock_screen.png';
import tavernScreen from '/public/assets/images/quest_screen.png';
import { useStore } from '../../../stores/store';


export function StationPage() {
  const router = useStore('Router');
  return <Page page="stationPage">
    <MainContainer title="Station" size={MainContainerSize.Small}>
      <Card title="Dock" image={dockImage} onEnter={router.goToDock}>
        <p>Dock - a place where you can buy, or improve your equipment. </p>
        <p>Collect money to buy stronger spaceships.
          Spend money to improve your weapons</p>
      </Card>
      <Card title="Tavern" image={tavernScreen} onEnter={router.goToTavern}>
        <p>Here you can pick a quest.</p>
        <p>There are 3 different types of quests:</p>
        <ul>
          <li> You need to deliver someting from point A to pointB</li>
          <li>You need to guard someone traveling from point A to point B</li>
          <li>You need to kill enemies</li>
        </ul>

      </Card>
      <div className={style.buttonWrapper}>
        <Button fixed onClick={router.goToStart}>Exit</Button>
      </div>
    </MainContainer>
  </Page>
}
