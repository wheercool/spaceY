import * as React from 'react';
import { useEffect } from 'react';

import style from './Page.css';

interface Page {
  page: string;
}

export const Page: React.FC<Page> = ({ page, children }) => {
  useEffect(() => {
    document.body.classList.add(page);
    return () => {
      document.body.classList.remove(page);
    }
  }, []);
  return <div className={style.page}>{children}</div>;
}

