import * as React from 'react';


import style from './MiniMap.css';
import { mulByScalar, Point2D } from '@shared/types/Point2D';
import playerMarkerImg from '/public/assets/images/player_marker.svg';
import { MinimapEntity } from '../../../stores/MinimapStore';
import { CircleMinimapShape, RectangleMinimapShape } from '../../../components/MinimapComponent';

const MINIMAP_SIZE = 200;

export interface MiniMap {
  entities: MinimapEntity[];
}

export const MiniMap: React.FC<MiniMap> = (
  {
    entities
  }
) => {
  return <div className={style.miniMap}>
    {
      entities.map((minimapEntity, index) => {
        switch (minimapEntity.shape.type) {
          case 'player':
            return player(minimapEntity.position, minimapEntity.rotation, index);
          case 'rectangle':
            return rectangle(minimapEntity.position, minimapEntity.rotation, minimapEntity.shape, index);
          case 'circle':
            return circle(minimapEntity.position, minimapEntity.rotation, minimapEntity.shape, index);
        }
      })
    }

  </div>
}

function player(position: Point2D, rotation: number, key: number) {
  const translate = mulByScalar(position, MINIMAP_SIZE);
  return <div key={key} className={style.playerMarker} style={{ transformOrigin: 'center', transform: transform(translate, rotation) }}>
    <img className={style.playerMarkerImage} src={playerMarkerImg} alt="player marker"/>
  </div>
}

function rectangle(position: Point2D, rotation: number, shape: RectangleMinimapShape, key: number) {
  const translate = mulByScalar(position, MINIMAP_SIZE);
  return <div key={key} className={style.rectangleMarker}
              style={{
                transformOrigin: 'center',
                transform: transform(translate, rotation),
                width: shape.width,
                height: shape.height,
                borderColor: shape.color,
                bottom: -0.5 * shape.width,
                left: -0.5 * shape.height
              }}>
  </div>
}

function circle(position: Point2D, rotation: number, shape: CircleMinimapShape, key: number) {
  const translate = mulByScalar(position, MINIMAP_SIZE);
  return <div key={key}
              className={style.circleMarker}
              style={{
                transformOrigin: 'center',
                transform: transform(translate, rotation),
                width: shape.radius,
                height: shape.radius,
                borderColor: shape.color,
                bottom: -0.5 * shape.radius,
                left: -0.5 * shape.radius
              }}>
  </div>
}


function transform(translate: Point2D, rotation: number) {
  return `translate(${translate.x}px,${-translate.y}px) rotate(${-rotation}rad)`
}
