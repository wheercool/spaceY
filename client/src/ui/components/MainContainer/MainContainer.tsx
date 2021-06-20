import * as React from 'react';
import style from './MainContainer.css';
import classNames from 'classnames';

export enum MainContainerSize {
  Normal,
  Small
}

interface MainContainer {
  title: string;
  size?: MainContainerSize;
}

export const MainContainer: React.FC<MainContainer> = (
  {
    title,
    size = MainContainerSize.Normal,
    children
  }) => {
  return <div className={classNames(style.mainContainer,
    {
      [style.mainContainerNormal]: size === MainContainerSize.Normal,
      [style.mainContainerSmall]: size === MainContainerSize.Small
    })}>
    <header className={style.header}>{title}</header>
    <div className={style.main}>
      {children}
    </div>
  </div>
}
