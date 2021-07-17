import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';
import style from './DockPage.css';
import { Carousel } from '../../components/Carousel/Carousel';
import { Page } from '../Page';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { Grid } from '../../components/Grid/Grid';
import { VerticalStack } from 'src/ui/components/VerticalStack/VerticalStack';
import { Spaceship } from '../../components/Spaceship/Spaceship';
import { SpaceshipInfo } from '../../components/SpaceshipInfo/SpaceshipInfo';
import { SpaceshipEquipment } from '../../components/SpaceshipEquipment/SpaceshipEquipment';
import { useStore } from '../../../stores/store';
import { observer } from 'mobx-react';
import classNames from 'classnames';

export const DockPage = observer(() => {
  const router = useStore('Router');
  const dock = useStore('Dock');
  const wallet = useStore('Wallet');

  return <Page page="dockPage">
    <MainContainer title='Dock' size={MainContainerSize.Normal} money={wallet.money.toFixed(0)}>
      <VerticalStack.Container>
        <VerticalStack.Rest>
          <Grid.Container>
            <Grid.MainColumn size={'medium'}>
              <VerticalStack.Container>
                <VerticalStack.Content>
                  <div className={style.carouselWrapper}>
                    <Carousel
                      title={dock.currentSpaceship.name}
                      onNext={dock.nextSpaceship}
                      onPrev={dock.prevSpaceship}
                      hasNext={dock.hasNextSpaceship}
                      hasPrev={dock.hasPrevSpaceship}
                    />
                  </div>
                </VerticalStack.Content>
                <VerticalStack.Rest>
                  <ContentContainer>
                    <div className={style.spaceshipWrapper}>
                      <Spaceship name={dock.currentSpaceship.name} locked/>
                    </div>
                  </ContentContainer>
                </VerticalStack.Rest>
              </VerticalStack.Container>
            </Grid.MainColumn>
            <Grid.SecondColumn size={'medium'}>
              <p className={classNames(style.cost, {
                [style.canBuy]: dock.hasMoneyToBuyCurrentSpaceship,
                [style.bought]: dock.isCurrentSpaceshipBought,
                [style.cannotBuy]: !dock.hasMoneyToBuyCurrentSpaceship
              })}>Cost: {dock.currentSpaceship.cost}$</p>
              <SpaceshipInfo info={dock.currentSpaceship.info}/>
              <SpaceshipEquipment/>
            </Grid.SecondColumn>
          </Grid.Container>
        </VerticalStack.Rest>
        <VerticalStack.Content>
          <div className={style.buttons}>
            <Button fixed onClick={router.gotoStation}>Back</Button>
            {
              dock.isCurrentSpaceshipBought
                ? <Button fixed
                          play="use"
                          onClick={dock.useCurrentSpaceship}
                          disabled={dock.isCurrentSpaceshipInUse}>Use</Button>
                : <Button fixed
                          play="buy"
                          onClick={dock.buyCurrentSpaceship}
                          disabled={!dock.hasMoneyToBuyCurrentSpaceship}>Buy</Button>
            }
          </div>
        </VerticalStack.Content>
      </VerticalStack.Container>
    </MainContainer>
  </Page>
})
