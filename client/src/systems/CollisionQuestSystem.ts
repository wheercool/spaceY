import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { CollisionQuestGoal, QuestStatus } from '../components/QuestComponent';
import { Entity } from '../entities/Entity';
import { ComponentsRegistry } from '../components/Components';
import { CollisionComponent, collisionEquals } from '../components/CollisionComponent';


export class CollisionQuestSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['quest'])
      .filter(entity => entity.quest.goal.type === 'collision');

    const collisions = registry.findEntitiesByComponents(['collision']);

    for (const questEntity of entities) {
      const goal: CollisionQuestGoal = questEntity.quest.goal;
      goal.collisions = removeCompletedCollisions(goal, collisions);
      if (isQuestFailed(goal, collisions)) {
        questEntity.quest.status = QuestStatus.Failed;
      }
      if (goal.collisions.length === 0) {
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
