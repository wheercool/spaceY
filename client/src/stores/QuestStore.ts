import { action, computed, makeObservable, observable } from 'mobx';
import { Quest, QuestDescription } from './Quest';
import { Entity } from '../entities/Entity';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Point2D } from '@shared/types/Point2D';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { QuestStatus } from '../components/QuestComponent';
import { Achievement, EntityId, QuestRequirement } from '../types';
import { RouterStore } from './RouterStore';
import { WalletStore } from './WalletStore';
import { PlayerAchievementsStore } from './PlayerAchievementsStore';
import { DialogStyle, ModalDialog } from './DialogStore';
import { createAsteroid, createEarth, createPlanet } from '../entities/templates';

export interface QuestManager {
  questCompleted(): void;

  questFailed(): void;

  setCurrentQuestInfo(questInfo: QuestInfo): void;
}

export interface QuestInfo {
  title: string;
  hint: string;
  goal: string;
}

export class QuestStore implements QuestManager {
  private quests: Quest[] = QuestStore.createQuests();
  @observable currentQuestIndex = 0;
  @observable currentQuestInfo: QuestInfo | null = null;

  @computed get currentQuest(): Quest {
    return this.quests[this.currentQuestIndex];
  }

  @computed get hasNextQuest(): boolean {
    return (this.currentQuestIndex + 1) < this.quests.length;
  }

  @computed get hasPrevQuest(): boolean {
    return this.currentQuestIndex > 0;
  }

  @computed get currentQuestRequirements(): QuestRequirement[] {
    return this.currentQuest.getQuestRequirements(this.playerAchievements.achievements);
  }

  @computed get canStartCurrentQuest(): boolean {
    return this.currentQuestRequirements.every(requirement => requirement.met);
  }

  constructor(
    private router: RouterStore,
    private modalDialog: ModalDialog,
    private wallet: WalletStore,
    private playerAchievements: PlayerAchievementsStore,
  ) {
    makeObservable(this);
  }

  @action.bound setCurrentQuestInfo(questInfo: QuestInfo): void {
    this.currentQuestInfo = questInfo;
  }

  async questCompleted() {
    await this.modalDialog.show('Mission completed', `Reward 100$. Back to station`, DialogStyle.Successful);
    this.wallet.money += this.currentQuest.reward;
    this.router.gotoStation();
  }

  async questFailed() {
    await this.modalDialog.show('Mission failed', 'Back to station', DialogStyle.Dangerous);
    this.router.gotoStation();
  }

  @action.bound nextQuest() {
    if (this.hasNextQuest) {
      this.currentQuestIndex++;
    }
  }

  @action.bound prevQuest() {
    if (this.hasPrevQuest) {
      this.currentQuestIndex--;
    }
  }

  getCurrentQuestMap(playerId: EntityId): Entity[] {
    switch (this.currentQuestIndex) {
      case 0:
        return this.tutorialQuestEntities(playerId);
      case 1:
        return this.firstQuestEntities(playerId);
      case 2:
        return this.secondQuestEntities();
    }
    return [];
  }

  private static createQuests(): Quest[] {
    return [
      QuestStore.createTutorial(),
      QuestStore.createFirstQuest(),
      QuestStore.createSecondQuest()
    ];
  }

  private static createTutorial(): Quest {
    const result = new Quest();
    result.title = 'Tutorial';
    result.description = QuestDescription.Tutorial;
    result.reward = 100;
    return result;
  }

  private static createFirstQuest(): Quest {
    const result = new Quest();
    result.title = 'Quest #1. Supernova';
    result.description = QuestDescription.FirstQuest;
    result.reward = 100;
    return result;
  }

  private static createSecondQuest() {
    const result = new Quest();
    result.title = 'Quest #2. Energy crystal';
    result.description = QuestDescription.SecondQuest;
    result.requiredAchievements = [Achievement.GravityGun];
    result.reward = 300;
    return result;
  }

  private firstQuestEntities(playerId: EntityId): Entity[] {
    const result: Entity[] = [];
    const mapWidth = 10000;
    const mapHeight = 10000;
    const asteroidsNumber = 100;
    const planetsNumber = 50;

    const map = new EntityBuilder()
      .applyComponent('map', { width: mapWidth, height: mapHeight })
      .build();


    const superNovaPosition = QuestStore.randomPosition(mapWidth, mapHeight);
    // Check if it spawned too close to the user, we put it a bit more far
    if (superNovaPosition.x < 0.1 * mapWidth && superNovaPosition.y < 0.1 * mapHeight) {
      if (Math.random() < 0.5) {
        superNovaPosition.x = 0.1 * mapWidth;
      } else {
        superNovaPosition.y = 0.1 * mapHeight;
      }
    }

    const superNova = new EntityBuilder()
      .applyComponents({
        model: 'supernova',
        position: superNovaPosition,
        boundaries: [
          {
            position: {
              x: 0,
              y: 0
            },
            radius: 500
          }
        ]
      })
      .build();

    for (let i = 0; i < asteroidsNumber; i++) {
      result.push(createAsteroid(QuestStore.randomPosition(mapWidth, mapHeight)));
    }

    for (let i = 0; i < planetsNumber; i++) {
      result.push(createPlanet(QuestStore.randomPosition(mapWidth, mapHeight)));
    }

    const quest = new EntityBuilder()
      .applyComponents({
        quest: {
          status: QuestStatus.InProgress,
          goal: {
            type: 'collision',
            text: 'Find supernova',
            collisions: [{
              entity1: superNova.id,
              entity2: playerId
            }]
          }
        }
      })
      .build();

    result.push(quest);
    result.push(map);
    result.push(superNova);
    return result;
  }

  private static randomPosition(mapWidth: number, mapHeight: number): Point2D {
    return {
      x: Math.round(Math.random() * mapWidth),
      y: Math.round(Math.random() * mapHeight),
    }
  }

  private secondQuestEntities() {
    const width = 2000;
    const height = 2000;
    const asteroidsNumber = 80;
    const map = new EntityBuilder()
      .applyComponents({
        map: {
          width,
          height
        }
      })
      .build()
    const crystal = new EntityBuilder()
      .applyComponents({
        model: 'crystal',
        boundaries: [
          {
            position: {
              x: 0,
              y: 0
            },
            radius: 60
          }
        ],
        position: {
          x: 100,
          y: 100
        },
        mass: 100,
        gravityBehaviour: createGravityBehaviour(GravityTagName.Cargo),
        mapDependent: true,
        onMinimap: {
          shape: {
            type: 'rectangle',
            width: 15,
            height: 15,
            color: '#27bb1f'
          }
        }
      })
      .build()

    const earth = EntityBuilder.fromEntity(
      createEarth({
        x: 1500,
        y: 1500
      }))
      .applyComponents({
        onMinimap: {
          shape: {
            type: 'circle',
            radius: 20,
            color: '#525f90'
          }
        }
      })
      .build();


    const quest = new EntityBuilder()
      .applyComponents({
        quest: {
          status: QuestStatus.InProgress,
          goal: {
            type: 'collision',
            text: 'Deliver the crystal to the Kepler',
            collisions: [
              {
                entity1: earth.id,
                entity2: crystal.id
              }
            ]
          }
        }
      })
      .build()

    const asteroids: Entity[] = [];
    for (let i = 0; i < asteroidsNumber; i++) {
      let position: Point2D;

      do {
        position = QuestStore.randomPosition(width, height);
      } while (position.x <= 180 && position.y <= 180);

      asteroids.push(createAsteroid(position));
    }

    return [
      map,
      crystal,
      earth,
      quest,
      ...asteroids
    ];
  }

  private tutorialQuestEntities(playerId: EntityId) {
    const result: Entity[] = [];

    const quest = new EntityBuilder()
      .applyComponent('tutorial', true)
      .build();

    result.push(quest);
    return result;
  }
}


