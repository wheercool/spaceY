import * as React from 'react';
import { useCallback, useState } from 'react';

import { Button } from '../../components/Button/Button';

import style from './StartPage.css';
import { Page } from '../Page';
import { observer } from 'mobx-react';
import { useStore } from '../../../stores/store';
import { Loader } from '../../components/Loader/Loader';

import logoImg from '/public/assets/images/logo.png';

export const StartPage = observer(() => {
  const router = useStore('Router');
  const rootStore = useStore('RootStore');
  const [loading, setLoading] = useState(false);
  const startHandler = useCallback(() => {
    setLoading(true);
    rootStore.loadAssets();
  }, [setLoading])

  return <Page page="startPage">
    {/*<MainContainer title='SPACEY' size={MainContainerSize.Normal}>*/}
    <img className={style.logo} src={logoImg} alt="logo"/>
    <div className={style.container}>
      {loading && <Loader percent={rootStore.assetsProgress}/>}
      {!loading && (
        <div className={style.buttons}>
          <Button fixed onClick={router.goToAbout}>About</Button>
          <Button fixed onClick={startHandler}>Start</Button>
        </div>)
      }
    </div>
  </Page>
})
