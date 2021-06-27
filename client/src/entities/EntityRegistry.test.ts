import { EntityBuilder } from './EntityBuilder';
import { EntityRegistry } from './EntityRegistry';
import { makeEntityId } from '../types';

interface TestComponentRegistry {
  prop1: number;
  prop2: string;
  prop3: boolean;
}

describe('Entities', () => {
  let registry: EntityRegistry;
  beforeEach(() => {
    registry = new EntityRegistry();
  })
  it('should add entity', () => {
    registry.addEntity({ id: makeEntityId(1) });
    expect(registry.entities.length).toEqual(1);
  })
  it('should remove entity by id', () => {
    registry.addEntity({ id: makeEntityId(1) });
    registry.addEntity({ id: makeEntityId(2) });
    registry.removeEntity(makeEntityId(1));
    expect(registry.entities.length).toEqual(1);
  })
  it('should find entity with component prop1', () => {
    const entity = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponent('prop1', 123)
      .build();

    registry.addEntity({ id: makeEntityId(2) });
    registry.addEntity({ id: makeEntityId(3) });
    registry.addEntity(entity)
    const searchResult = registry.findEntitiesByComponents<'prop1', TestComponentRegistry>(['prop1']);
    expect(searchResult).toEqual([{ id: 1, prop1: 123 }]);
  })
  it('should find entity with multiple components: prop1, prop2, prop3', () => {
    const entity1 = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponent('prop1', 123)
      .build();

    const entity2 = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponent('prop1', 345)
      .applyComponent('prop2', '123')
      .build();

    const entity3 = new EntityBuilder<TestComponentRegistry>(3)
      .applyComponent('prop1', 11)
      .applyComponent('prop2', 'hello')
      .applyComponent('prop3', true)
      .build()


    registry.addEntity(entity1);
    registry.addEntity(entity2);
    registry.addEntity(entity3);

    const searchResult = registry.findEntitiesByComponents<'prop1' | 'prop2' | 'prop3', TestComponentRegistry>(['prop1', 'prop2', 'prop3']);
    expect(searchResult).toEqual([{ id: 3, prop1: 11, prop2: 'hello', prop3: true }]);
  })
})
