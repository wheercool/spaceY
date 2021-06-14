import { EntityRegistry } from '../entities/EntityRegistry';

export interface System {
  update(registry: EntityRegistry): void;
}
