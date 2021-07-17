import * as React from 'react';
import style from './SpaceshipEquipment.css';
import rocket from '/public/assets/images/rocket.png';
import energyShield from '/public/assets/images/energy_shield.png';
import gravityGun from '/public/assets/images/gravity_gun.png';
import turret from '/public/assets/images/turret.png';
import { EquipmentName, Fact, mergeFacts } from '../../../types';
import { Grid } from '../Grid/Grid';
import { UpgradeButton } from '../UpgradeButton/UpgradeButton';
import arrowRight from '/public/assets/images/arrow-right.svg';
import { Button } from '../Button/Button';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useStore } from '../../../stores/store';
import { Weapon } from '../../../stores/Weapon';
import { useCallback } from 'react';
import { soundManager } from '../../../services/SoundManager';

const equipmentImages: Record<EquipmentName, string> = {
  [EquipmentName.Rocket]: rocket,
  [EquipmentName.EnergyShield]: energyShield,
  [EquipmentName.GravityGun]: gravityGun,
  [EquipmentName.Turret]: turret
}

interface SpaceshipEquipmentItem {
  equipment: Weapon;
}

interface SpaceshipFacts {
  facts: Fact[];
}

interface SpaceshipFactsWithUpgrades {
  facts: Fact[];
  upgradedFacts: Fact[];
}

export const SpaceshipFacts: React.FC<SpaceshipFacts> = observer((
  {
    facts
  }) => {
  return <div className={style.facts}>
    {facts.map(fact =>
      <div className={style.fact} key={fact.name}>
        <div className={style.factName}>{fact.name}</div>
        <div className={style.factValue}>{fact.displayValue}</div>
      </div>)}
  </div>
})

export const SpaceshipFactsWithUpgrades: React.FC<SpaceshipFactsWithUpgrades> = observer((
  {
    facts,
    upgradedFacts
  }) => {
  const mergedFacts = mergeFacts(facts, upgradedFacts);
  return <div className={style.facts}>
    {mergedFacts.map(fact => <div className={style.fact} key={fact.name}>
      <div className={style.factName}>{fact.name}</div>
      <div className={style.factOldValue}>{fact.value}</div>
      {fact.newValue !== '' && <img className={style.arrowRight} src={arrowRight} alt="arrow right"/>}
      <div className={style.factNewValue}>{fact.newValue}</div>
    </div>)}
  </div>
})

export const SpaceshipEquipmentItem: React.FC<SpaceshipEquipmentItem> = observer((
  {
    equipment,
  }
) => {
  const dock = useStore('Dock');
  const upgradeWeapon = useCallback(() => {
    dock.upgradeWeapon(equipment);
    soundManager.play('upgrade')
  }, [dock, equipment]);
  return <div className={style.spaceshipEquipmentItem}>
    <header>
      <p className={style.equipmentName}>{equipment.name}</p>
      <p className={style.equipmentLevel}>level {equipment.level}</p>
      {equipment.hasUpgrade && dock.isCurrentSpaceshipBought && <div className={style.upgradeContainer}>
        <UpgradeButton onClick={upgradeWeapon}
                       disabled={!dock.hasMoney(equipment.cost)}/>
        +{equipment.cost}$
      </div>}
    </header>
    <div className={style.equipmentBodyContainer}>
      <Grid.Container>
        <Grid.MainColumn>
          <div className={classNames(style.mainColumnWrapper)} style={{ opacity: equipment.bought ? 1 : 0.3 }}>
            <img className={style.equipmentImage} src={equipmentImages[equipment.name]} alt={equipment.name}/>
          </div>
        </Grid.MainColumn>
        <Grid.SecondColumn size={'auto'}>
          <div className={style.columnWrapper}>
            {equipment.upgradedFacts.length > 0 && dock.isCurrentSpaceshipBought
              ? <SpaceshipFactsWithUpgrades facts={equipment.facts} upgradedFacts={equipment.upgradedFacts}/>
              : <SpaceshipFacts facts={equipment.facts}/>
            }
          </div>
          {equipment.canBuy && <div className={style.buttonWrapper}>
            <Button onClick={() => {
            }} fixed small play="buy">Buy</Button>
          </div>
          }
        </Grid.SecondColumn>
      </Grid.Container>

    </div>
  </div>
})

export const SpaceshipEquipment: React.FC = observer((
) => {
  const spaceships = useStore('Dock');

  return <div className={style.spaceshipEquipment}>
    {spaceships.currentSpaceship.weapons.map(item => <SpaceshipEquipmentItem key={item.name}
                                                   equipment={item}/>)}
  </div>
})

