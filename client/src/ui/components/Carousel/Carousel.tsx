import * as React from 'react';
import style from './Carousel.css';
import { PrevButton } from '../PrevButton/PrevButton';
import { NextButton } from '../NextButton/NextButton';
import { useCallback } from 'react';
import { soundManager } from '../../../services/SoundManager';

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
  const prev = useCallback(() => {
    soundManager.play('action');
    onPrev();
  }, [onPrev])
  const next = useCallback(() => {
    soundManager.play('action');
    onNext();
  }, [onNext])
  return <div className={style.carousel}>
    <PrevButton onClick={prev} disabled={!hasPrev}/>
    <h2 className={style.title}>{title}</h2>
    <NextButton onClick={next} disabled={!hasNext}/>
  </div>
}
