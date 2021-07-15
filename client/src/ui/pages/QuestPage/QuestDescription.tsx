import * as React from 'react';
import { QuestDescription } from '../../../stores/Quest';
import supernovaImg from '/public/assets/images/supernova_hires.jpg';
import crystalImg from '/public/assets/images/crystal.png';
import gravityGunImg from '/public/assets/images/gravity_gun_small.png';


import style from './QuestDescription.css'

interface Props {
  description: QuestDescription;
}

export const Tutorial = () => {
  return <div className={style.container}>
    <p>Pass tutorial in order to be able to do next quests</p>
    <p>Here you will train how to fly</p>
    <p>You will learn about gravity</p>
  </div>
}
export const FirstQuest = () => {
  return <div className={style.container}>
    <div className={style.imageWrapper}>
      <img src={supernovaImg} alt="supernova"/>
    </div>
    <p>Our scientists have found some indication that somewhere in our galaxy a new supernova has been born.
      It cause a lot of issues to the neighbouring systems so we decided to destroy it.</p>
    <p>You are one of the pilots who was picked.</p>
    <p>You mission is to find it. The rest work is on us.<br/>
      Please, hurry up because the behaviour of supernova is unpredictable.</p>
  </div>
}

export const SecondQuest = () => {
  return <div className={style.container}>
    <div className={style.imageWrapper}>
      <img src={crystalImg} alt="crystal"/>
    </div>
    <p>
      You proved your are a good pilot. We have another job for you. <br/>
      One of our ally has energy crisis on its planet. They spent all resources they had and do not have hig-level technologies. <br/>
      Our leaders decided to help them. <br/>
      We provide them energy crystal that can supply whole planet for several ages until they discover a new technology. <br/>
      You should transport it. <br/>
      In order to do it you have to use "Gravity gun"<img style={{verticalAlign: 'middle', margin: '0 10px'}} src={gravityGunImg} alt="gravity gun"/> which can pull and push objects in space.<br/>
      If you press <em>"Q"</em> the "Gravity gun" will pull objects around you. <br/>
      If you press <em>"W"</em> it will pull them out of you. <br/>
      <em>Be aware, that gravity gun pulls and pushes asteroids too</em><br/>
      Make sure you do not damage neither yourself nor the crystal. <br/>
      Good luck!<br/>
    </p>
  </div>
}


export const QuestsDescription: React.FC<Props> = (
  {
    description
  }) => {
  switch (description) {
    case QuestDescription.Tutorial:
      return <Tutorial/>;
    case QuestDescription.FirstQuest:
      return <FirstQuest/>;
    case QuestDescription.SecondQuest:
      return <SecondQuest/>;
  }
  return <></>;
};
