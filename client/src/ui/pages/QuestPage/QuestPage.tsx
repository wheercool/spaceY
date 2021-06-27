import * as React from 'react';

import { Button } from '../../components/Button/Button';
import { MainContainer, MainContainerSize } from '../../components/MainContainer/MainContainer';
import style from './QuestPage.css';
import { Carousel } from '../../components/Carousel/Carousel';
import { Page } from '../Page';
import { ContentContainer } from '../../components/ContentContainer/ContentContainer';
import { Grid } from '../../components/Grid/Grid';
import { VerticalStack } from 'src/ui/components/VerticalStack/VerticalStack';
import { QuestRequirements } from '../../components/QuestRequirements/QuestRequirements';
import { observer } from 'mobx-react';
import { useStore } from '../../../stores/store';
import { QuestsDescription } from './QuestDescription';


export const QuestPage = observer(() => {
    const questStore = useStore('Quest');
    const router = useStore('Router');
    const currentQuest = questStore.currentQuest;
    const requirements = currentQuest.requirements;

    return <Page page="questPage">
      <MainContainer title='Tavern' size={MainContainerSize.Normal}>
        <VerticalStack.Container>
          <VerticalStack.Rest>
            <Grid.Container>
              <Grid.MainColumn>
                <VerticalStack.Container>
                  <VerticalStack.Content>
                    <div className={style.carouselWrapper}>
                      <Carousel
                        title={currentQuest.title}
                        onNext={questStore.nextQuest}
                        onPrev={questStore.prevQuest}
                        hasNext={questStore.hasNextQuest}
                        hasPrev={questStore.hasPrevQuest}
                      />
                    </div>
                  </VerticalStack.Content>
                  <VerticalStack.Rest>
                    <ContentContainer>
                      <QuestsDescription description={currentQuest.description}/>
                    </ContentContainer>
                  </VerticalStack.Rest>
                </VerticalStack.Container>
              </Grid.MainColumn>
              <Grid.SecondColumn>
                <p className={style.reward}>Reward: {currentQuest.reward}$</p>
                { requirements.length > 0 && <QuestRequirements requirements={requirements}/>}
              </Grid.SecondColumn>
            </Grid.Container>
          </VerticalStack.Rest>
          <VerticalStack.Content>
            <div className={style.buttons}>
              <Button fixed onClick={router.gotoStation}>Back</Button>
              <Button fixed onClick={router.goToPlay}>Accept</Button>
            </div>
          </VerticalStack.Content>
        </VerticalStack.Container>
      </MainContainer>
    </Page>
  }
)
