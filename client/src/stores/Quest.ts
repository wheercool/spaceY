import { makeObservable, observable } from 'mobx';
import { QuestRequirement } from '../types';


export enum QuestDescription {
  FirstQuest,
  SecondQuest
}

export class Quest {
  @observable title = '';
  @observable description: QuestDescription = QuestDescription.FirstQuest;
  @observable requirements: QuestRequirement[] = [];
  @observable reward: number = 0;

  constructor() {
    makeObservable(this);
  }
}
