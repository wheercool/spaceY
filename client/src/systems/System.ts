import { EntityRegistry } from '../entities/EntityRegistry';

export interface System {
  init(registry: EntityRegistry): void;
  update(registry: EntityRegistry): void;
  dispose?(): void;
}
