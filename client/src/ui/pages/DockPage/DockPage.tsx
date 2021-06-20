import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';
import style from './DockPage.css';
import { Carousel } from '../../components/Carousel/Carousel';
import { Page } from '../Page';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { Grid } from '../../components/Grid/Grid';
import { VerticalStack } from 'src/ui/components/VerticalStack/VerticalStack';
import { QuestRequirements } from '../../components/QuestRequirements/QuestRequirements';
import { QuestRequirement, SpaceshipName } from '../../../types';
import { Spaceship } from '../../components/Spaceship/Spaceship';

function noop() {

}

const requirements: QuestRequirement[] = [
  { name: 'Gravity gun', met: true },
  { name: 'Quest #1', met: false },
  { name: 'Turret', met: false },
]

export function DockPage() {
  return <Page page="dockPage">
    <MainContainer title='Dock' size={MainContainerSize.Normal}>
      <VerticalStack.Container>
        <VerticalStack.Rest>
          <Grid.Container>
            <Grid.MainColumn size={'medium'}>
              <VerticalStack.Container>
                <VerticalStack.Content>
                  <div className={style.carouselWrapper}>
                    <Carousel
                      title="Valkiria"
                      onNext={noop}
                      onPrev={noop}
                      hasNext={true}
                      hasPrev={true}
                    />
                  </div>
                </VerticalStack.Content>
                <VerticalStack.Rest>
                  <ContentContainer>
                    <div className={style.spaceshipWrapper}>
                      <Spaceship name={SpaceshipName.Rabbit} locked/>
                    </div>
                  </ContentContainer>
                </VerticalStack.Rest>
              </VerticalStack.Container>
            </Grid.MainColumn>
            <Grid.SecondColumn size={'medium'}>
              <p className={style.cost}>Cost: 200$</p>
              <QuestRequirements requirements={requirements}/>
            </Grid.SecondColumn>
          </Grid.Container>
        </VerticalStack.Rest>
        <VerticalStack.Content>
          <div className={style.buttons}>
            <Button fixed onClick={() => alert('Hello')}>Back</Button>
            <Button fixed onClick={() => alert('Hello')}>Buy</Button>
          </div>
        </VerticalStack.Content>
      </VerticalStack.Container>
    </MainContainer>
  </Page>
}
