import * as React from 'react';
import style from './MainContainer.css';
import classNames from 'classnames';
import { observer } from 'mobx-react';

export enum MainContainerSize {
  Normal,
  Small
}

interface MainContainer {
  title: string;
  size?: MainContainerSize;
  money?: string;
}

export const MainContainer: React.FC<MainContainer> = observer((
  {
    title,
    size = MainContainerSize.Normal,
    money = '',
    children
  }) => {
  return <div className={classNames(style.mainContainer,
    {
      [style.mainContainerNormal]: size === MainContainerSize.Normal,
      [style.mainContainerSmall]: size === MainContainerSize.Small
    })}>
    <header className={style.header}>{title} {money && <span className={style.money}>{money}$</span>}</header>
    <div className={style.main}>
      {children}
    </div>
  </div>
})
