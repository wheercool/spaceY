import * as React from 'react';
import style from './Grid.css';

interface Size {
  size?: 'medium' | 'big' | 'small' | 'auto'
}

const sizeWidth = {
  'medium': '50%',
  'small': '25%',
  'big': '75%',
  'auto': 'auto'
}

const Container: React.FC = (
  {
    children
  }) => {
  return <div className={style.grid}>{children}</div>
}

const MainColumn: React.FC<Size> = (
  {
    size = 'big',
    children,
  }) => {
  return <div className={style.mainColumn} style={{ width: sizeWidth[size] }}>{children}</div>
}
const SecondColumn: React.FC<Size> = (
  {
    size = 'small',
    children
  }) => {

  return <div className={style.secondColumn} style={{ width: sizeWidth[size] }}>{children}</div>
}

export const Grid = {
  Container,
  MainColumn,
  SecondColumn
}
