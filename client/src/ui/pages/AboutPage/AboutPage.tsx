import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './AboutPage.css';
import { Page } from '../Page';
import { useStore } from '../../../stores/store';

export function AboutPage() {
  const router = useStore('Router');

  return <Page page="aboutPage">
    <div className={style.wrapper}>
      <MainContainer title='About' size={MainContainerSize.Small}>
        <p>Created by: Aleksander Rudy</p>
        <p>Technologies used in the game:</p>
        <ul>
          <li>React</li>
          <li>MobX</li>
          <li>ThreeJS</li>
        </ul>
        <br/>
        <p className={style.center}>wheercool@gmail.com</p>

        <div className={style.buttons}>
          <Button fixed onClick={router.goToStart}>Back</Button>
        </div>
      </MainContainer>
    </div>
  </Page>
}
