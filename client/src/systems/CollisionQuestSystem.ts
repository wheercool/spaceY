import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { CollisionQuestGoal, PressKeyGoal, QuestStatus } from '../components/QuestComponent';
import { Entity } from '../entities/Entity';
import { ComponentsRegistry } from '../components/Components';
import { CollisionComponent, collisionEquals } from '../components/CollisionComponent';
import { Controller } from '../services/Controller';

export class CollisionQuestSystem implements System {
  controller = new Controller();

  constructor() {

  }
  dispose() {
    this.controller.dispose();
  }

  init(registry: EntityRegistry): void {

  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['quest']);

    const collisionQuestEntities = entities.filter(entity => entity.quest.goal.type === 'collision');
    this.updateCollisionQuests(collisionQuestEntities, registry);

    const pressKeyQuestEntity = entities.filter(entity => entity.quest.goal.type === 'presskey');
    this.updatePressKeyQuests(pressKeyQuestEntity, registry);
  }

  private updateCollisionQuests(collisionQuestEntities: (Entity & Pick<ComponentsRegistry, 'quest'>)[], registry: EntityRegistry) {
    const collisions = registry.findEntitiesByComponents(['collision']);

    for (const questEntity of collisionQuestEntities) {
      const goal: CollisionQuestGoal = questEntity.quest.goal as CollisionQuestGoal;
      goal.collisions = removeCompletedCollisions(goal, collisions);
      if (isQuestFailed(goal, collisions)) {
        questEntity.quest.status = QuestStatus.Failed;
      }
      if (goal.collisions.length === 0) {
        questEntity.quest.status = QuestStatus.Completed;
      }
    }
  }

  private updatePressKeyQuests(pressKeyQuestEntity: (Entity & Pick<ComponentsRegistry, 'quest'>)[], registry: EntityRegistry) {
   for (const questEntity of pressKeyQuestEntity) {
     const goal: PressKeyGoal = questEntity.quest.goal as PressKeyGoal;
     if (this.controller.isKeyPressed(goal.key)) {
       questEntity.quest.status = QuestStatus.Completed;
     }
   }
  }
}

function removeCompletedCollisions(goal: CollisionQuestGoal,
                                   collisionEntities: (Entity & Pick<ComponentsRegistry, 'collision'>)[]): CollisionComponent[] {
  return goal.collisions
    .filter(goalCollision => !collisionEntities.some(collisionEntity => collisionEquals(goalCollision, collisionEntity.collision)));
}

// TODO: Do we need health?
function isQuestFailed(goal: CollisionQuestGoal,
                       collisions: (Entity & Pick<ComponentsRegistry, 'collision'>)[]): boolean {
  return false;
}
