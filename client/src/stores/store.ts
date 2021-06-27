import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';
import { DockStore } from './DockStore';
import { WalletStore } from './WalletStore';

const rootStore = new RootStore();
const walletStore = new WalletStore();

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: new RouterStore(),
  Dock: new DockStore(walletStore),
  Wallet: walletStore
});
