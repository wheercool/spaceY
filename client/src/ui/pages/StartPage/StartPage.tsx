import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './StartPage.css';
import { Page } from '../Page';

export function StartPage() {
  return <Page page="startPage">
    <div className={style.wrapper}>
      <MainContainer title='SPACEY' size={MainContainerSize.Normal}>
        <div className={style.buttons}>
          <Button fixed onClick={() => alert('Hello')}>Start</Button>
          <Button fixed onClick={() => alert('Hello')}>About</Button>
        </div>
      </MainContainer>
    </div>
  </Page>
}
