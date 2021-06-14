import { Entity } from './Entity';
import { ComponentsRegistry, ComponentValue } from '../components/Components';


export class EntityBuilder<CmpRegistry = ComponentsRegistry> {
  static lastId = 1;
  private entity: Entity;

  constructor(id?: number) {
    this.entity = {
      id: id ?? EntityBuilder.lastId++
    };
  }

  static fromEntity<CmpRegistry>(entity: Entity): EntityBuilder<CmpRegistry> {
    const builder = new EntityBuilder();
    builder.entity = entity;
    return builder;
  }

  applyComponent<Cmp extends keyof CmpRegistry>(component: Cmp, value: ComponentValue<Cmp, CmpRegistry>): EntityBuilder<CmpRegistry> {
    (this.entity as any)[component] = value;
    return this;
  }

  applyComponents(config: Partial<CmpRegistry>): EntityBuilder<CmpRegistry> {
    Object.assign(this.entity, config);
    return this;
  }

  removeComponent<Cmp extends keyof CmpRegistry>(component: Cmp): EntityBuilder<CmpRegistry> {
    (this.entity as any)[component] = undefined;
    return this;
  }

  build(): Entity {
    return this.entity;
  }
}
