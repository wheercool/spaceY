import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';

import style from './AboutPage.css';
import { Page } from '../Page';

export function AboutPage() {
  return <Page page="startPage">
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
          <Button fixed onClick={() => alert('Back')}>Back</Button>
        </div>
      </MainContainer>
    </div>
  </Page>
}