import { action, computed, makeObservable, observable } from 'mobx';
import { Quest, QuestDescription } from './Quest';

export class QuestStore {
  private quests: Quest[] = QuestStore.createQuests();
  @observable currentQuestIndex = 0;

  @computed get currentQuest(): Quest {
    return this.quests[this.currentQuestIndex];
  }

  @computed get hasNextQuest(): boolean {
    return (this.currentQuestIndex + 1) < this.quests.length;
  }

  @computed get hasPrevQuest(): boolean {
    return this.currentQuestIndex > 0;
  }

  @computed get canStartCurrentQuest(): boolean {
    return this.currentQuest.requirements.every(requirement => requirement.met);
  }

  constructor() {
    makeObservable(this);
  }

  @action.bound nextQuest() {
    if (this.hasNextQuest) {
      this.currentQuestIndex++;
    }
  }

  @action.bound prevQuest() {
    if (this.hasPrevQuest) {
      this.currentQuestIndex--;
    }
  }

  private static createQuests(): Quest[] {
    return [
      QuestStore.createFirstQuest(),
      QuestStore.createSecondQuest()
    ];
  }

  private static createFirstQuest(): Quest {
    const result = new Quest();
    result.title = 'Quest #1';
    result.description = QuestDescription.FirstQuest;
    result.reward = 100;
    return result;
  }

  private static createSecondQuest() {
    const result = new Quest();
    result.title = 'Quest #2';
    result.description = QuestDescription.SecondQuest;
    result.requirements = [
      { name: 'hello, world', met: false}
    ]
    result.reward = 300;
    return result;
  }
}
