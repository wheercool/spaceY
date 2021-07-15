import { CollisionComponent } from './CollisionComponent';

export enum QuestStatus {
  InProgress,
  Failed,
  Completed
}

export interface QuestComponent {
  status: QuestStatus;
  goal: QuestGoal;
}

export type QuestGoal = CollisionQuestGoal;

export interface CollisionQuestGoal {
  type: 'collision';
  text: string;
  collisions: CollisionComponent[]
}
