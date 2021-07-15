import { makeObservable, observable } from 'mobx';
import { Achievement, QuestRequirement } from '../types';


export enum QuestDescription {
  Tutorial,
  FirstQuest,
  SecondQuest
}

export class Quest {
  @observable title = '';
  @observable description: QuestDescription = QuestDescription.FirstQuest;
  @observable requiredAchievements: Achievement[] = [];
  @observable reward: number = 0;

  getQuestRequirements(playerAchievements: Achievement[]): QuestRequirement[] {
    return this.requiredAchievements.map(achievement => {
      return {
        name: achievement,
        met: playerAchievements.some(playerAchievement => playerAchievement === achievement)
      }
    })
  }

  constructor() {
    makeObservable(this);
  }
}
