import React, { createRef, useEffect } from 'react';
import { WebGL3DRendererSystem } from '../../../systems/WebGL3DRendererSystem';
import { SpaceshipPanel } from '../../components/SpaceshipPanel/SpaceshipPanel';
import { Game } from '../../../systems/Game';
import { assetsManager } from '../../../services/AssetsManager';
// import { assetsManager } from '../services/AssetsManager';
import style from './GamePage.css';
import { MiniMap } from '../../components/MiniMap/MiniMap';
import { useStore } from 'src/stores/store';
import { UiNotificationSystem } from '../../../systems/UiNotificationSystem';
import { observer } from 'mobx-react';

export const GamePage = observer(() => {
  const miniMap = useStore('Minimap');
  const spaceshipPanel = useStore('SpaceshipPanel');
  const space = useStore('Space');
  const canvasRef = createRef<HTMLCanvasElement>();
  const pageRef = createRef<HTMLDivElement>();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const renderer = new WebGL3DRendererSystem(canvasRef.current)
    const uiNotificator = new UiNotificationSystem(miniMap, spaceshipPanel);
    assetsManager.load().then(() => {
      new Game(renderer, uiNotificator)
        .init(space.getEntityRegistry())
        .startGame();
    });
    const resizeHandler = () => {
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;

      if (pageRef.current) {
        pageRef.current.style.width = WIDTH + 'px';
        pageRef.current.style.height = HEIGHT + 'px';
      }
      renderer.updateSize(WIDTH, HEIGHT);
    };
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, []);

  return <div className={style.gamePage} ref={pageRef} style={{ width: WIDTH, height: HEIGHT }}>
    <canvas width={WIDTH} height={HEIGHT} ref={canvasRef} style={{ width: WIDTH, height: HEIGHT }}/>
    <div className={style.overlay}>
      <div className={style.miniMapWrapper}>
        <MiniMap player={miniMap.player} rotation={miniMap.rotation}/>
      </div>
      <div className={style.spaceShipPanelWrapper}>
        <SpaceshipPanel/>
      </div>
    </div>
  </div>
})