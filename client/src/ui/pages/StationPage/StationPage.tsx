import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './StationPage.css';
import { Page } from '../Page';
import { Card } from '../../components/Card/Card';
import dockImage from '/public/assets/images/dock_screen.jpg';
import tavernScreen from '/public/assets/images/quest_screen.jpg';
import { useStore } from '../../../stores/store';


export function StationPage() {
  const router = useStore('Router');
  return <Page page="stationPage">
    <MainContainer title="Station" size={MainContainerSize.Small}>
      <Card title="Dock" image={dockImage} onEnter={router.goToDock}>
        <p>Dock - a place where you can buy, or improve your equipment. </p>
        <p>Collect money to buy stronger spaceships.
          Spend money to improve your weapons</p>
        <p>You can have multiple spaceships</p>
        <p>To switch to another spaceship click "Use" button</p>
      </Card>
      <Card title="Tavern" image={tavernScreen} onEnter={router.goToTavern}>
        <p>Here you can pick a quest.</p>
        <ul>
          <li>Make sure to pass a tutorial before you start real quests</li>
          <li>Each quest will give you reward</li>
          <li>Some quests require items to be present in order to take it</li>
        </ul>

      </Card>
      <div className={style.buttonWrapper}>
        <Button fixed onClick={router.goToStart}>Exit</Button>
      </div>
    </MainContainer>
  </Page>
}
