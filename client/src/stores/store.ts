import { createContext } from './storeUtils';
import { RootStore } from './RootStore';

const rootStore = new RootStore();

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
});