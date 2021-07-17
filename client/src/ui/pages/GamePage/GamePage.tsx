import React, { createRef, useEffect } from 'react';
import { WebGL3DRendererSystem } from '../../../systems/WebGL3DRendererSystem';
import { SpaceshipPanel } from '../../components/SpaceshipPanel/SpaceshipPanel';
import { Game } from '../../../systems/Game';
import style from './GamePage.css';
import { MiniMap } from '../../components/MiniMap/MiniMap';
import { useStore } from 'src/stores/store';
import { UiNotificationSystem } from '../../../systems/UiNotificationSystem';
import { observer } from 'mobx-react';
import { CurrentQuestInfo } from '../../components/CurrentQuestInfo/CurrentQuestInfo';
import { Tutorial } from '../../../systems/Tutorial/Tutorial';

export const GamePage = observer(() => {
  const miniMap = useStore('Minimap');
  const spaceshipPanel = useStore('SpaceshipPanel');
  const space = useStore('Space');
  const quest = useStore('Quest');
  const canvasRef = createRef<HTMLCanvasElement>();
  const pageRef = createRef<HTMLDivElement>();
  const WIDTH = window.innerWidth;
  const HEIGHT = window.innerHeight;

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const renderer = new WebGL3DRendererSystem(canvasRef.current)
    const uiNotificator = new UiNotificationSystem(miniMap, spaceshipPanel, quest);
    const registry = space.getEntityRegistry()
    const isTutorial = registry.findEntitiesByComponents(['tutorial']).length > 0;

    const runner = isTutorial ? new Tutorial(renderer, uiNotificator) : new Game(renderer, uiNotificator);

    runner
      .init(registry)
      .startGame();

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
      runner.dispose();
    }
  }, []);

  return <div className={style.gamePage} ref={pageRef} style={{ width: WIDTH, height: HEIGHT }}>
    <canvas width={WIDTH} height={HEIGHT} ref={canvasRef} style={{ width: WIDTH, height: HEIGHT }}/>
    <div className={style.overlay}>
      <div className={style.miniMapWrapper}>
        {miniMap.visible ? <MiniMap entities={miniMap.entities}/> : null}
      </div>
      <div className={style.spaceShipPanelWrapper}>
        <SpaceshipPanel/>
      </div>
    </div>
    <div className={style.questOverlay}>
      <div className={style.questStatusWrapper}>
        <CurrentQuestInfo/>
      </div>
    </div>
  </div>
})
