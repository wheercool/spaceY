import * as React from 'react';
import { StationPage } from '../../pages/StationPage/StationPage';
import { StartPage } from '../../pages/StartPage/StartPage';
import { QuestPage } from '../../pages/QuestPage/QuestPage';
import { AboutPage } from '../../pages/AboutPage/AboutPage';
import { DockPage } from '../../pages/DockPage/DockPage';
import { Route } from '../../../stores/RouterStore';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react';
import { GamePage } from '../../pages/GamePage/GamePage';

const routing: Record<Route, () => JSX.Element> = {
  'start': StartPage,
  'station': StationPage,
  'quest': QuestPage,
  'about': AboutPage,
  'dock': DockPage,
  'play': GamePage
}

export const Router = observer(() => {
  const router = useStore('Router');
  const Cmp = routing[router.route];
  return <Cmp/>;
})
