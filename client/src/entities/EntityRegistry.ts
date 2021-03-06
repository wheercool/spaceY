import { ComponentsRegistry } from '../components/Components';
import { Entity } from './Entity';
import { EntityId } from '../types';

export class EntityRegistry {
  readonly entities: Entity[] = [];

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  removeEntity(id: Entity['id']) {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  findEntitiesByComponents<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry>(components: Cmp[]): (Entity & Pick<CmpRegistry, Cmp>)[] {
    const result: (Entity & Pick<CmpRegistry, Cmp>)[] = [];
    for (const entity of this.entities) {
      const entityProperties = Object.keys(entity);
      if (components.every(component => entityProperties.includes(component as string))) {
        result.push(entity as any);
      }
    }
    return result;
  }

  findSingle<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry>(components: Cmp[]): (Entity & Pick<CmpRegistry, Cmp>) {
    for (const entity of this.entities) {
      const entityProperties = Object.keys(entity);
      if (components.every(component => entityProperties.includes(component as string))) {
        return entity as any;
      }
    }
    throw new Error(`Cannot find entity with components: ${components.join(',')}`)
  }

  findById(id: number) {
    const entity = this.entities.find(entity => entity.id === id);
    if (!entity) {
      throw new Error(`Cannot find entity with id: ${id}`)
    }
    return entity;
  }

  existEntityWithId(id: EntityId): boolean {
    return !!this.entities.find(entity => entity.id === id);
  }
}
