import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './StartPage.css';
import { Page } from '../Page';
import { observer } from 'mobx-react';
import { useStore } from '../../../stores/store';

export const StartPage = observer(() => {
  const router = useStore('Router');

  return <Page page="startPage">
    <div className={style.wrapper}>
      <MainContainer title='SPACEY' size={MainContainerSize.Normal}>
        <div className={style.buttons}>
          <Button fixed onClick={router.gotoStation}>Start</Button>
          <Button fixed onClick={router.goToAbout}>About</Button>
        </div>
      </MainContainer>
    </div>
  </Page>
})
