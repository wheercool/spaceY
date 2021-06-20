import * as React from 'react';
import { useEffect, useState } from 'react';
import { StationPage } from '../../pages/StationPage/StationPage';
import { StartPage } from '../../pages/StartPage/StartPage';
import { QuestPage } from '../../pages/QuestPage/QuestPage';
import { AboutPage } from '../../pages/AboutPage/AboutPage';
import { DockPage } from '../../pages/DockPage/DockPage';


const routing = {
  'start': StartPage,
  'station': StationPage,
  'quest': QuestPage,
  'about': AboutPage,
  'dock': DockPage
}
type Route = keyof typeof routing;

export function Router() {
  const [page, changePage] = useState<Route>('start');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    changePage(page as Route);

  }, []);
  const Cmp = routing[page] ?? routing['start'];
  return <Cmp/>;
}
