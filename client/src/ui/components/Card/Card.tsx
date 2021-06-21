import * as React from 'react';
import style from './Card.css';
import { ContentContainer } from '../ContentContainer/ContentContainer';
import { Button } from '../Button/Button';

type Card = {
  title: string;
  image: string;
  onEnter(): void;
}

export const Card: React.FC<Card> = (
  {
    title,
    image,
    children,
    onEnter
  }
) => {
  return <div className={style.card}>
    <header className={style.cardHeader}>{title}</header>
    <ContentContainer>
      <div className={style.container}>
        <div className={style.imageWrapper}>
          <img className={style.cardImage} src={image} alt={title}/>
        </div>
        <div className={style.contentWrapper}>
          {children}
        </div>
      </div>
      <div className={style.buttonWrapper}>
        <Button onClick={onEnter} small fixed>Enter</Button>
      </div>
    </ContentContainer>
  </div>
}
