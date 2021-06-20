import * as React from 'react';
import style from './Grid.css';

export const Container: React.FC = (
  {
    children
  }) => {
  return <div className={style.grid}>{children}</div>
}
export const MainColumn: React.FC = (
  {
    children,
  }) => {
  return <div className={style.mainColumn}>{children}</div>
}
export const SecondColumn: React.FC = (
  {
    children
  }) => {
  return <div className={style.secondColumn}>{children}</div>
}

export const Grid = {
  Container,
  MainColumn,
  SecondColumn
}
