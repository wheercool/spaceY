import * as React from 'react';
import style from './Carousel.css';
import { PrevButton } from '../PrevButton/PrevButton';
import { NextButton } from '../NextButton/NextButton';

interface Carousel {
  title: string;

  onNext(): void;

  onPrev(): void;

  hasNext: boolean;
  hasPrev: boolean;
}

export const Carousel: React.FC<Carousel> = (
  {
    title,
    onNext,
    onPrev,
    hasNext,
    hasPrev
  }
) => {
  return <div className={style.carousel}>
    <PrevButton onClick={onPrev} disabled={!hasPrev}/>
    <h2 className={style.title}>{title}</h2>
    <NextButton onClick={onNext} disabled={!hasNext}/>
  </div>
}
