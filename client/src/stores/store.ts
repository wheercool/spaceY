import { createContext } from './storeUtils';
import { RootStore } from './RootStore';
import { RouterStore } from './RouterStore';
import { DockStore } from './DockStore';
import { WalletStore } from './WalletStore';
import { MinimapStore } from './MinimapStore';
import { SpaceshipPanelStore } from './SpaceshipPanelStore/SpaceshipPanelStore';
import { SpaceStore } from './SpaceStore';
import { QuestStore } from './QuestStore';
import { PlayerAchievementsStore } from './PlayerAchievementsStore';
import { DialogStore, ModalDialog, ModalDialogConsumer } from './DialogStore';

const walletStore = new WalletStore();
const routerStore = new RouterStore();
const rootStore = new RootStore(routerStore);
const dockStore = new DockStore(walletStore);
const playerAchievements = new PlayerAchievementsStore(dockStore);
const dialogStore = new DialogStore();
const questStore = new QuestStore(routerStore, dialogStore, walletStore, playerAchievements)

export const { StoreProvider, useStore } = createContext({
  RootStore: rootStore,
  Router: routerStore,
  Dock: dockStore,
  Wallet: walletStore,
  Minimap: new MinimapStore(),
  SpaceshipPanel: new SpaceshipPanelStore(),
  Space: new SpaceStore(routerStore, dockStore, questStore),
  Quest: questStore,
  PlayerAchievements: playerAchievements,
  ModalDialog: dialogStore as ModalDialog,
  ModalDialogConsumer: dialogStore as ModalDialogConsumer
});
