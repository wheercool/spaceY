import { ComponentsRegistry } from '../components/Components';
import { EntityId } from '../types';

export interface Entity {
  id: EntityId;
}

type WithComponent<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry> = Record<Cmp, CmpRegistry[Cmp]>;

export function hasEntityComponent<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry>(entity: Entity, component: Cmp): entity is Entity & WithComponent<Cmp, CmpRegistry> {
  return (entity as any)[component] !== undefined;
}
