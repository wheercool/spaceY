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
import { QuestRequirement } from '../../../types';
import {observer} from 'mobx-react';
import { useStore } from '../../../stores/store';

function noop() {

}

const requirements: QuestRequirement[] = [
  { name: 'Gravity gun', met: true },
  { name: 'Quest #1', met: false },
  { name: 'Turret', met: false },
]

export const QuestPage = observer(() => {
  const store = useStore('RootStore');
  const router = useStore('Router');

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
                      title={store.quest}
                      onNext={store.onNext}
                      onPrev={noop}
                      hasNext={true}
                      hasPrev={true}
                    />
                  </div>
                </VerticalStack.Content>
                <VerticalStack.Rest>
                  <ContentContainer>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, assumenda beatae consequuntur debitis eaque enim
                    magni
                    nam
                    neque quo saepe sequi voluptatibus? Animi architecto aut, cupiditate eum laboriosam maxime rem repudiandae soluta
                    veniam?
                    Deserunt facere illo nostrum? Dignissimos id labore necessitatibus. Aliquid architecto asperiores aspernatur aut, cum
                    deleniti
                    dolor id inventore laboriosam, laborum libero modi nesciunt odit provident sunt, tenetur vero? Autem commodi corporis
                    culpa
                    deleniti, ducimus incidunt iusto laudantium magni minima obcaecati quasi, quibusdam saepe totam. Beatae dicta, enim illo
                    incidunt laboriosam laborum odio officia quia ratione reprehenderit. Dolore natus nihil sunt. Consectetur error hic in
                    iusto,
                    nam nulla provident quae quod ratione rerum. Amet consequuntur earum exercitationem in laudantium officia quos
                    repellendus
                    tempora, unde voluptatum. Autem delectus hic id nesciunt nostrum perspiciatis quod quos rerum veritatis voluptatum?
                    Assumenda
                    deserunt dicta dignissimos enim? Aliquam animi cupiditate fugiat harum minima omnis veniam vitae. Deserunt dolores illum
                    maxime. Culpa impedit laborum molestias nam perferendis praesentium reiciendis repellat similique totam. Ab adipisci
                    alias
                    aliquid aperiam architecto assumenda commodi consequuntur dicta dignissimos doloremque eaque earum eligendi eos error ex
                    fuga,
                    incidunt inventore, iusto laudantium magnam magni maiores modi molestias mollitia nulla odio omnis provident quae quos,
                    reiciendis repellat suscipit ullam unde veniam veritatis vero vitae. Atque consequuntur debitis enim explicabo ipsa
                    iusto
                    maiores nemo quo repellendus tempore, vero vitae voluptate. Ab alias atque aut, blanditiis dolorum eligendi expedita
                    illum,
                    libero, molestiae neque quia unde ut. Adipisci doloremque id magnam molestiae odit! Consectetur corporis cumque eligendi
                    esse
                    modi molestias perferendis quod ratione sint tempore! Ad aliquam aspernatur atque autem cum, debitis error expedita
                    facere
                    illo laudantium nobis numquam obcaecati odit officia possimus quasi repudiandae soluta suscipit unde vero. Aliquid eaque
                    enim
                    magni minus mollitia nisi nobis optio pariatur. Aliquid at corporis libero natus perferendis possimus, reiciendis vel
                    veniam!
                    At commodi consequatur doloribus enim explicabo fugiat, in itaque laudantium, modi odit suscipit veniam voluptatibus. A
                    accusantium blanditiis dicta eligendi excepturi expedita nihil nisi repellat rerum sequi. Adipisci deserunt ex fuga
                    harum
                    labore magnam obcaecati! Ab alias aliquam aperiam at blanditiis delectus dignissimos distinctio dolore doloribus, enim
                    eos
                    et
                    exercitationem expedita explicabo illum in incidunt ipsa ipsam iure libero nam necessitatibus nostrum nulla obcaecati
                    porro
                    quia quidem quisquam quo quos recusandae reiciendis rem tempora vel? Beatae deserunt doloribus optio recusandae
                    sapiente.
                    Amet
                    eaque facere illum incidunt obcaecati officiis optio reiciendis? Asperiores at autem blanditiis consectetur debitis
                    deserunt,
                    dolore dolores dolorum eaque illo libero minima molestiae nesciunt placeat quam totam, velit voluptate? Aspernatur
                    commodi
                    dignissimos distinctio dolores ea eius magni non officia quas quidem? Ad aliquid consectetur, culpa dicta dolores
                    dolorum
                    earum, error est eum eveniet illum labore laborum magnam molestias nostrum quam quisquam repellendus sapiente sit,
                    voluptas.
                    A
                    aliquam, architecto delectus eaque eos excepturi facere impedit laboriosam minima minus molestiae molestias mollitia nam
                    natus
                    obcaecati placeat praesentium provident quae ratione repellat, temporibus ullam vitae. Ab amet assumenda aut cumque
                    deleniti
                    dolore dolorem, ea excepturi fuga fugiat labore odit omnis optio possimus quae quas quis recusandae saepe vero voluptas.
                    Accusamus, minus nemo. Aperiam asperiores assumenda atque, cumque cupiditate dolores eius ex excepturi harum illo
                    incidunt
                    labore laborum minus molestias nam nisi quo quos saepe sapiente velit voluptas voluptate voluptatum. Aliquam at delectus
                    deleniti dignissimos eaque, eos eum illo illum inventore nobis perspiciatis possimus quis quod quos repellat sequi
                    similique,
                    sit tenetur veritatis voluptatem. Ad animi assumenda at aut commodi deleniti distinctio dolor ducimus fugit ipsum labore
                    libero maxime mollitia neque nesciunt perferendis quis reprehenderit, saepe sit suscipit tempora vel, veniam! Ad autem
                    blanditiis cupiditate dicta doloremque dolorum ducimus enim harum iusto magnam molestias nihil nostrum officiis porro
                    quam,
                    quo quos repellat sed sequi, vel veniam voluptate, voluptatibus voluptatum. A accusantium aliquam aperiam assumenda at
                    cupiditate, debitis delectus dolores esse est fugiat id incidunt inventore labore laboriosam mollitia necessitatibus
                    nostrum
                    optio quibusdam sed similique soluta tempora veniam veritatis voluptatem! Aut distinctio doloremque ipsam numquam
                    pariatur
                    placeat porro possimus unde! Est et explicabo fugit, maxime minus praesentium reiciendis rem veritatis? Architecto, sint
                    soluta! Aliquam beatae deleniti distinctio, harum illum incidunt magnam minima nam natus necessitatibus nihil odio
                    officia
                    optio praesentium quis quo quos repudiandae, sed sunt veritatis! Accusamus ad asperiores cupiditate delectus distinctio
                    doloremque ducimus eius eligendi harum inventore itaque labore laboriosam laborum magnam molestiae nemo omnis optio
                    porro
                    quae, quos ratione rem repellendus reprehenderit repudiandae rerum tempore ullam voluptatem. Architecto aspernatur
                    dolorum
                    earum explicabo harum impedit in perspiciatis quas soluta? Aut eveniet itaque pariatur sunt! Alias aperiam aspernatur
                    consequuntur, dolore expedita, ipsam minima modi molestias non odio officia optio quaerat quia quidem quisquam quo
                    similique
                    ullam voluptas voluptates voluptatum? Accusantium autem consectetur consequuntur, cumque dolorum earum eos id illum
                    iusto
                    laudantium nihil nisi placeat quaerat quas sed suscipit voluptatibus. Ab accusantium adipisci aliquid architecto commodi
                    consequatur consequuntur culpa, cupiditate delectus dolor dolore enim esse ex excepturi fugiat hic magni minus
                    necessitatibus
                    nobis odit officia officiis optio pariatur perferendis possimus praesentium quasi quibusdam ratione rem repellendus
                    sapiente
                    sed sit soluta tempore tenetur veniam voluptates? Ad beatae consequuntur cumque laboriosam, nesciunt numquam odio optio
                    quos
                    reprehenderit sint temporibus veritatis vitae. Aut eum harum ipsum itaque nulla optio vel! A accusantium aliquid
                    aspernatur
                    blanditiis consequuntur corporis cupiditate dignissimos distinctio eligendi eos est illo magni maxime minus
                    necessitatibus
                    non
                    nulla, odit optio perferendis quae quis ratione repudiandae sed sint soluta sunt suscipit tempora tenetur velit
                    voluptas! Ad
                    dolor explicabo harum ipsum placeat recusandae sequi suscipit tempora tempore voluptatum. Dolores fugiat id libero odio
                    possimus reprehenderit sapiente! Architecto aut error libero maxime nisi! Accusantium ad animi aspernatur blanditiis
                    delectus
                    deserunt dicta dignissimos distinctio dolor dolore dolorem doloremque doloribus, eaque enim error facere fugiat hic
                    labore
                    laboriosam laborum magnam minima nam, necessitatibus nesciunt, nostrum nulla numquam officiis placeat quo quos repellat
                    reprehenderit rerum sint. Deserunt iste maxime molestiae pariatur. Commodi expedita necessitatibus quaerat quod
                    repudiandae,
                    tenetur vel. A aliquam aspernatur at dolor enim natus rerum. Deleniti dolore eligendi eum ex exercitationem impedit
                    maxime
                    modi natus nihil non nulla numquam officiis quo ratione repellat repudiandae sit totam velit voluptates, voluptatum?
                    Ipsum
                    natus quisquam recusandae veritatis. Consequatur distinctio eligendi error exercitationem iusto neque rerum similique
                    ullam?
                  </ContentContainer>
                </VerticalStack.Rest>
              </VerticalStack.Container>
            </Grid.MainColumn>
            <Grid.SecondColumn>
              <p className={style.reward}>Reward: 200$</p>
              <QuestRequirements requirements={requirements}/>
            </Grid.SecondColumn>
          </Grid.Container>
        </VerticalStack.Rest>
        <VerticalStack.Content>
          <div className={style.buttons}>
            <Button fixed onClick={router.gotoStation}>Back</Button>
            <Button fixed onClick={() => alert('Hello')}>Accept</Button>
          </div>
        </VerticalStack.Content>
      </VerticalStack.Container>
    </MainContainer>
  </Page>
}
)