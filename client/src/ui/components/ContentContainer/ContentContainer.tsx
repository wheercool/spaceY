import * as React from 'react';

import style from './ContentContainer.css';

interface ContentContainer {

}

export const ContentContainer: React.FC<ContentContainer> = (
  {
    children
  }
) => {
  return <div className={style.contentContainer}>
    {children}
  </div>
}
