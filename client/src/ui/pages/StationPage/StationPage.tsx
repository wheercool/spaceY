import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './StationPage.css';
import { Page } from '../Page';

export function StationPage() {
  return <Page page="stationPage">
    {/*<div className={style.wrapper}>*/}
      <MainContainer title='Station' size={MainContainerSize.Small}>
        <div className={style.buttons}>
          <Button fixed onClick={() => alert('Hello')}>Dock</Button>
          <Button fixed onClick={() => alert('Hello')}>Quest</Button>
          <Button fixed onClick={() => alert('Hello')}>Exit</Button>
        </div>
      </MainContainer>
    {/*</div>*/}
  </Page>
}
