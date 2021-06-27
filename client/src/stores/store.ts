import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';
import { DockStore } from './DockStore';
import { WalletStore } from './WalletStore';
import { MinimapStore } from './MinimapStore';
import { SpaceshipPanelStore } from './SpaceshipPanelStore/SpaceshipPanelStore';
import { SpaceStore } from './SpaceStore';

const rootStore = new RootStore();
const walletStore = new WalletStore();

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: new RouterStore(),
  Dock: new DockStore(walletStore),
  Wallet: walletStore,
  Minimap: new MinimapStore(),
  SpaceshipPanel: new SpaceshipPanelStore(),
  Space: new SpaceStore()
});
