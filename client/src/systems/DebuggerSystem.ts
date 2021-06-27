import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { ComponentsRegistry } from '../components/Components';

export class DebuggerSystem implements System {
  constructor(
    private label: string,
    private components: (keyof ComponentsRegistry)[],
    private selector: (entity: any) => any = entity => entity
  ) {
  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const value = this.selector(registry.findEntitiesByComponents(this.components));
    console.log(this.label, value)
  }

}
