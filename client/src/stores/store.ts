import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';
import { DockStore } from './DockStore';
import { WalletStore } from './WalletStore';
import { MinimapStore } from './MinimapStore';
import { SpaceshipPanelStore } from './SpaceshipPanelStore/SpaceshipPanelStore';
import { SpaceStore } from './SpaceStore';
import { QuestStore } from './QuestStore';

const walletStore = new WalletStore();
const routerStore = new RouterStore();
const rootStore = new RootStore(routerStore);
const dockStore = new DockStore(walletStore);
export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: routerStore,
  Dock: dockStore,
  Wallet: walletStore,
  Minimap: new MinimapStore(),
  SpaceshipPanel: new SpaceshipPanelStore(),
  Space: new SpaceStore(routerStore, dockStore),
  Quest: new QuestStore()
});
