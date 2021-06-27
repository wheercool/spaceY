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
  const canvasRef = createRef<HTMLCanvasElement>();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const renderer = new WebGL3DRendererSystem(canvasRef.current)
    const uiNotificator = new UiNotificationSystem(miniMap);
    assetsManager.load().then(() => {
      new Game(renderer, uiNotificator).startGame();
    })
  }, []);

  return <div className="gamePage" style={{ width: WIDTH, height: HEIGHT }}>
    <canvas width={WIDTH} height={HEIGHT} ref={canvasRef}/>
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
