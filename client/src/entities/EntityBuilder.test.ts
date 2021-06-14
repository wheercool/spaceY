import { EntityBuilder } from './EntityBuilder';

interface TestComponentRegistry {
  prop1: number;
  prop2: string;
  prop3: boolean;
}

describe('EntityBuilder', () => {
  it('should build empty entity with id', () => {
    const entity = new EntityBuilder(1)
      .build();

    expect(entity).toEqual({ id: 1 });
  })

  it('should generate new id if no specified', () => {
    const entity = new EntityBuilder()
      .build();
    expect(entity).toHaveProperty('id');
  })

  it('should add component to entity', () => {
    const entity = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponent('prop1', 42)
      .build();
    expect(entity).toEqual({ id: 1, prop1: 42 });
  })
  it('should add multiple components to entity', () => {
    const entity = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponents({ prop1: 42, prop2: 'hello' })
      .build();

    expect(entity).toEqual({ id: 1, prop1: 42, prop2: 'hello' });
  })

  it('should load with existing entity', () => {
    const entity = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponents({ prop3: true })
      .build();

    const entity2 = EntityBuilder.fromEntity<TestComponentRegistry>(entity)
      .build();
    expect(entity2).toBe(entity);
  })

  it('should remove component', () => {
    const entity = new EntityBuilder<TestComponentRegistry>(1)
      .applyComponents({prop1: 42, prop2: 'test', prop3: false})
      .removeComponent('prop1')
      .build();

    expect(entity).toEqual({id: 1, prop2: 'test', prop3: false});
  })
})
