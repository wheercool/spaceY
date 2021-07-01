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

export interface QuestManager {
  questCompleted(): void;

  questFailed(): void;
}

export class QuestStore implements QuestManager {
  private quests: Quest[] = QuestStore.createQuests();
  @observable currentQuestIndex = 0;

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
    private wallet: WalletStore,
    private playerAchievements: PlayerAchievementsStore
  ) {
    makeObservable(this);
  }

  questCompleted(): void {
    //TODO: Add dialog that will show reward and button "Go to Station"
    alert('Completed');
    this.wallet.money += this.currentQuest.reward;
    this.router.gotoStation();
  }

  questFailed(): void {
    alert('Failed');
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
        return this.firstQuestEntities(playerId);
      case 1:
        return this.secondQuestEntities(playerId);
    }
    return [];
  }

  private static createQuests(): Quest[] {
    return [
      QuestStore.createFirstQuest(),
      QuestStore.createSecondQuest()
    ];
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

    for (let i = 0; i < 100; i++) {
      result.push(createAsteroid(QuestStore.randomPosition(mapWidth, mapHeight)));
    }

    for (let i = 0; i < 50; i++) {
      result.push(createPlanet(QuestStore.randomPosition(mapWidth, mapHeight)));
    }

    for (let i = 0; i < 5; i++) {
      result.push(createPlanet(QuestStore.randomPosition(mapWidth, mapHeight)));
    }

    const quest = new EntityBuilder()
      .applyComponents({
        quest: {
          status: QuestStatus.InProgress,
          goal: {
            type: 'collision',
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

  private secondQuestEntities(playerId: EntityId) {
    const width = 800;
    const height = 1000;
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
        mapDependent: true
      })
      .build()

    const earth = createEarth({
      x: 400,
      y: 400
    });

    const quest = new EntityBuilder()
      .applyComponents({
        quest: {
          status: QuestStatus.InProgress,
          goal: {
            type: 'collision',
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
    return [
      map,
      crystal,
      earth,
      quest
    ];
  }
}


function createAsteroid(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'asteroid',
      mass: 100,
      maxSpeed: 10,
      asteroid: true,
      boundaries: [
        {
          position: { x: 0, y: 2 },
          radius: 19
        }
      ],
      mapDependent: true,
      gravityBehaviour: createGravityBehaviour(GravityTagName.Enemy)
    })
    .build();
}

function createPlanet(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'planet',
      mass: 10000,
      static: true,
      boundaries: [{
        radius: 100,
        position: {
          x: 0,
          y: 0
        }
      }],
      gravityBehaviour: createGravityBehaviour(GravityTagName.Big),
    })
    .build()
}

function createEarth(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'earth',
      boundaries: [
        {
          position: { x: 0, y: 0 },
          radius: 100
        }
      ],
      mapDependent: true,
    })
    .build()
}
