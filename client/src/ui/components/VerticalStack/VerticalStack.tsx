import * as React from 'react';

import style from './VerticalStack.css';

const Container: React.FC = (
  { children }
) => {
  return <div className={style.container}>{children}</div>
}

const Content: React.FC = (
  {
    children
  }
) => {
  return <div className={style.content}>{children}</div>
}


const Rest: React.FC = (
  {
    children
  }
) => {
  return <div className={style.rest}>{children}</div>
}
export const VerticalStack = {
  Container,
  Content,
  Rest
}
