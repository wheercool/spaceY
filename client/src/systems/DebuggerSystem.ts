import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { ComponentsRegistry } from '../components/Components';

export class DebuggerSystem implements System {
  private needToLog = false;
  private label: string = '';
  private components: (keyof ComponentsRegistry)[] = [];
  private selector: (entity: any) => any = entity => entity;

  constructor() {
  }

  log(label: string, components: (keyof ComponentsRegistry)[], selector: (entity: any) => any) {
    this.needToLog = true;
    this.label = label;
    this.components = components;
    this.selector = selector;
    return this;
  }

  init(registry: EntityRegistry): void {
    (window as any).registry = registry;
  }

  update(registry: EntityRegistry): void {
    if (this.needToLog) {
      const value = this.selector(registry.findEntitiesByComponents(this.components));
      console.log(this.label, value)
    }
  }
}
