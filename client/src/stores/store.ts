import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';

const rootStore = new RootStore();

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: new RouterStore()
});
