import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';
import { SpaceshipStore } from './SpaceshipStore';

const rootStore = new RootStore();

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: new RouterStore(),
  Spaceships: new SpaceshipStore()
});
