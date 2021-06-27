import * as React from 'react';


import style from './MiniMap.css';
import { mulByScalar, Point2D } from '@shared/types/Point2D';
import playerMarkerImg from '/public/assets/images/player_marker.svg';


export interface MiniMap {
  player: Point2D;
  rotation: number;
}

export const MiniMap: React.FC<MiniMap> = (
  {
    player,
    rotation
  }
) => {
  const translate = mulByScalar(player, 200);
  return <div className={style.miniMap}>
    <div className={style.playerMarker} style={{ transformOrigin: 'center', transform: transform(translate, rotation) }}>
      <img className={style.playerMarkerImage} src={playerMarkerImg} alt="player marker"/>
    </div>
  </div>
}

function transform(translate: Point2D, rotation: number) {
  return `translate(${translate.x}px,${-translate.y}px) rotate(${-rotation}rad)`
}
