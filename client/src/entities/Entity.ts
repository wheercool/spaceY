import { ComponentsRegistry } from '../components/Components';

export interface Entity {
  id: number;
}

type WithComponent<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry> = Record<Cmp, CmpRegistry[Cmp]>;

export function hasEntityComponent<Cmp extends keyof CmpRegistry, CmpRegistry = ComponentsRegistry>(entity: Entity, component: Cmp): entity is Entity & WithComponent<Cmp, CmpRegistry> {
  return (entity as any)[component] !== undefined;
}
