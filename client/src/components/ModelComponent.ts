import { AssetsManager } from '../services/AssetsManager';

/***
 * Name of 3D model that gets used to render an entity
 */
export type ModelComponent = keyof AssetsManager['models'];
