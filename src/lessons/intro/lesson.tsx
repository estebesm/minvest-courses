import {
  Bank,
  BookOpenText,
  Buildings,
  ChartBar,
  ChartLineUp,
  CheckCircle,
  CurrencyBtc,
  Funnel,
  GlobeHemisphereWest,
  HandCoins,
  Lightbulb,
  MagnifyingGlass,
  Newspaper,
  PaperPlaneTilt,
  Question,
  ShoppingCartSimple,
  SlidersHorizontal,
  Stack as StackIcon,
  Target,
  Vault,
  Wallet,
} from '@phosphor-icons/react';
import React from 'react';
import {
  AppAmount,
  AppButton,
  AppCard,
  AppCell,
  AppChart,
  AppChecks,
  AppChips,
  AppFact,
  AppHeading,
  AppImage,
  AppInput,
  AppLines,
  AppList,
  AppNews,
  AppNote,
  AppPills,
  AppPrice,
  AppRange,
  AppRow,
  AppScale,
  AppScreen,
  AppSearch,
  AppSegments,
  AppShareBar,
  AppShortcuts,
  AppSplash,
  AppStockHeader,
  Arrow,
  Avatar,
  AvatarStack,
  Box,
  Camera,
  Card,
  Donut,
  Emphasis,
  Fly,
  Icon,
  Illustration,
  Logo,
  LogoMark,
  MbankTile,
  Meter,
  Orbit,
  Panel,
  Phone,
  Pill,
  Place,
  Pop,
  Row,
  Scatter,
  Sparkles,
  Sparkline,
  Stack,
  Stamp,
  Tile,
  color,
  type Lesson,
} from '../../kit';

/**
 * Урок «Знакомство с приложением».
 * Текст говорит диктор и показывают субтитры; на экране — телефон с приложением,
 * 3D-картинки и 1–2 слова. Главная картинка каждой сцены появляется сразу.
 */

const priceUp = [20, 22, 21, 25, 24, 28, 27, 31, 30, 34, 33, 38, 41];
const calm = [10, 10.6, 11.1, 11.9, 12.4, 13.2, 13.7, 14.5, 15, 15.8, 16.4];
const wild = [10, 15, 8, 17, 9, 20, 7, 16, 22, 11, 19];

export const introLesson: Lesson = {
  brand: <Logo height={34} />,
  sfx: 'audio/intro-sfx.wav',
  scenes: [
    {
      id: 'why',
      layout: 'free',
      narration:
        'Представьте, что вы хотите купить акцию компании, но пока не знаете, где её искать и как проходит покупка. Для этого и нужен MInvest: в приложении собраны инструменты, которые помогают постепенно знакомиться с инвестициями и управлять своим счётом.',
      render: ({cue}) => (
        // Камера: крупно «хочу купить акцию» → отъезд, появляется телефон → наезд на приложение
        <Camera
          start={{x: 520, y: 460, zoom: 1.28}}
          shots={[
            {at: cue('Для') - 0.5, zoom: 1, duration: 1.4},
            {at: cue('инструменты') - 0.3, x: 1280, y: 460, zoom: 1.12, duration: 1.8},
            {at: cue('управлять') - 0.2, x: 1100, y: 460, zoom: 1, duration: 2},
          ]}
        >
          <Place x={640} y={430}>
            <Emphasis pulse={[cue('акцию')]} dim={[[cue('инструменты'), 999]]}>
              <Illustration name="building" size={520} at={0.1} />
            </Emphasis>
          </Place>
          <Place x={150} y={560}>
            <Illustration name="wallet" size={280} at={0.35} backdrop="none" phase={1} />
          </Place>
          <Arrow from={{x: 270, y: 470}} to={{x: 440, y: 400}} curve={-40} at={cue('купить') - 0.2} flow={{every: 0.34, until: cue('но')}} />
          <Place x={850} y={650}>
            <Pill text="Акция" at={cue('акцию')} />
          </Place>
          {[
            {x: 330, y: 200, tone: 'accent' as const},
            {x: 900, y: 190, tone: 'primary' as const},
            {x: 980, y: 440, tone: 'accent' as const},
          ].map((q, i) => (
            <Place key={i} x={q.x} y={q.y}>
              <Pop at={cue('не') + i * 0.35} out={cue('Для') + i * 0.1} float phase={i * 2}>
                <Icon icon={Question} size={76} tone={q.tone} badge />
              </Pop>
            </Place>
          ))}

          <Sparkles x={1400} y={460} radius={470} at={cue('Для') + 0.6} seed={4} count={9} />
          <Place x={1400} y={470}>
            <Emphasis pulse={[cue('MInvest')]}>
              <Phone at={cue('Для') - 0.3} width={370}>
                <AppSplash at={cue('Для') - 0.3} />
              </Phone>
            </Emphasis>
          </Place>
          <Orbit x={1400} y={470} rx={360} ry={330} at={cue('собраны') - 0.2} stagger={0.28} speed={0.2}>
            <Icon icon={MagnifyingGlass} size={64} badge />
            <Icon icon={ChartLineUp} size={64} tone="positive" badge />
            <Avatar name="apple" size={104} shadow />
            <Icon icon={Newspaper} size={64} tone="info" badge />
            <Avatar name="btc" size={104} shadow />
            <Icon icon={Wallet} size={64} tone="accent" badge />
          </Orbit>
        </Camera>
      ),
    },
    {
      id: 'what',
      layout: 'free',
      narration:
        'MInvest — цифровой брокерский сервис в экосистеме MBANK. Им можно пользоваться в отдельном приложении или перейти к нему из MBANK. Через MInvest вы можете искать инвестиционные инструменты, изучать их и отправлять заявки на покупку или продажу.',
      render: ({cue}) => (
        <Camera
          start={{x: 960, y: 470, zoom: 1.3}}
          shots={[
            {at: cue('экосистеме') - 0.5, x: 720, y: 460, zoom: 1.08, duration: 1.4},
            {at: cue('Через') - 0.4, x: 1180, y: 460, zoom: 1.04, duration: 1.6},
          ]}
        >
          <Sparkles x={960} y={460} radius={420} at={0.7} seed={7} />
          <Place x={430} y={410}>
            <Emphasis pulse={[cue('MBANK'), cue('MBANK', 2)]}>
              <Pop at={cue('экосистеме') - 0.3} float>
                <MbankTile size={230} />
              </Pop>
            </Emphasis>
          </Place>
          <Place x={430} y={610}>
            <Pill text="MBANK" tone="positive" at={cue('MBANK')} />
          </Place>
          <Arrow from={{x: 580, y: 400}} to={{x: 760, y: 400}} curve={50} at={cue('перейти')} />

          <Place x={960} y={470}>
            <Emphasis pulse={[cue('отдельном')]}>
              <Phone at={0.1} width={370}>
                <AppScreen tab={1}>
                  <AppSearch text="Apple" at={cue('искать')} />
                  <AppShortcuts />
                  <AppHeading title="Популярные акции" all />
                  <AppList>
                    <AppRow avatar="apple" title="Apple" subtitle="AAPL" value="231,40 $" change={1.2} at={cue('Через')} selectAt={cue('искать') + 0.7} />
                    <AppRow avatar="nvidia" title="NVIDIA" subtitle="NVDA" value="142,10 $" change={2.4} at={cue('Через') + 0.12} />
                    <AppRow avatar="microsoft" title="Microsoft" subtitle="MSFT" value="418,00 $" change={-0.6} at={cue('Через') + 0.24} />
                    <AppRow avatar="tesla" title="Tesla" subtitle="TSLA" value="338,20 $" change={3.1} at={cue('Через') + 0.36} />
                  </AppList>
                </AppScreen>
                <AppScreen
                  enterAt={cue('изучать') - 0.2}
                  toolbar={{trailing: 'bookmark_unclicked'}}
                  bottom={
                    <>
                      <AppButton label="Продать" kind="secondary" />
                      <AppButton label="Купить" pressAt={cue('отправлять')} />
                    </>
                  }
                >
                  <AppStockHeader avatar="apple" name="Apple" ticker="AAPL" />
                  <AppPills size={16} items={['Обзор', 'О компании', 'Аналитика', 'Новости']} />
                  <AppPrice price="231,40 $" change="2,75 $ · 1,2%" />
                  <AppChart data={priceUp} at={cue('изучать') + 0.3} />
                  <AppPills items={['Д', 'Н', 'М', '6М', '1Г', 'Все время']} active={2} />
                </AppScreen>
                <AppSplash at={0.1} out={cue('Через')} />
              </Phone>
            </Emphasis>
          </Place>

          <Place x={1500} y={230}>
            <Card layout="horizontal" width={440} label="Искать" icon={MagnifyingGlass} at={cue('искать')} />
          </Place>
          <Place x={1500} y={420}>
            <Card layout="horizontal" width={440} label="Изучать" icon={BookOpenText} tone="info" at={cue('изучать')} />
          </Place>
          <Place x={1500} y={610}>
            <Card layout="horizontal" width={440} label="Заявки" icon={PaperPlaneTilt} tone="accent" at={cue('отправлять')} />
          </Place>
          <Fly from={{x: 1000, y: 760}} to={{x: 1330, y: 620}} curve={-90} at={cue('отправлять') + 0.1} duration={0.9} orient>
            <Icon icon={PaperPlaneTilt} size={64} tone="accent" />
          </Fly>
          <Place x={1390} y={790}>
            <Pill text="Купить" tone="positive" at={cue('покупку')} size="md" />
          </Place>
          <Place x={1610} y={790}>
            <Pill text="Продать" tone="negative" at={cue('продажу')} size="md" />
          </Place>
        </Camera>
      ),
    },
    {
      id: 'exchanges',
      layout: 'free',
      narration:
        'Начать можно с изучения компаний. В приложении доступны акции, торгующиеся на NASDAQ и NYSE, — например, бумаги крупных американских компаний. Это две биржи, а не весь мировой рынок: бирж и компаний гораздо больше. Список доступных инструментов может меняться, поэтому актуальные варианты всегда можно посмотреть в приложении.',
      render: ({cue}) => (
        // Камера отъезжает: две биржи оказываются маленькой частью большого мира
        <Camera
          start={{zoom: 1.12}}
          shots={[
            {at: cue('NASDAQ') - 0.4, zoom: 1, duration: 1.2},
            {at: cue('Это') - 0.2, zoom: 0.56, duration: 2.6},
            {at: cue('Список') - 0.5, zoom: 1, duration: 1.5},
          ]}
        >
          <Place x={960} y={460}>
            <Pop at={cue('Это') - 0.1} out={cue('Список') - 0.4} opacity={0.3} bounce="soft">
              <Icon icon={GlobeHemisphereWest} size={2100} tone="neutral" />
            </Pop>
          </Place>
          <Scatter
            icon={Bank}
            count={30}
            bounds={{x0: -700, y0: -340, x1: 2620, y1: 1260}}
            hole={{x0: 180, y0: 60, x1: 1740, y1: 860}}
            at={cue('две')}
            stagger={0.11}
            out={cue('Список') - 0.4}
            size={96}
            seed={3}
          />

          <Place x={470} y={400}>
            <Emphasis pulse={[cue('NASDAQ')]} dim={[[cue('Список'), 999]]}>
              <Illustration name="building" size={420} at={0.1} />
            </Emphasis>
          </Place>
          <Place x={470} y={690}>
            <Pill text="NASDAQ" at={cue('NASDAQ')} />
          </Place>
          <Place x={1450} y={400}>
            <Emphasis pulse={[cue('NYSE')]} dim={[[cue('Список'), 999]]}>
              <Illustration name="building" size={420} at={0.3} phase={1.6} />
            </Emphasis>
          </Place>
          <Place x={1450} y={690}>
            <Pill text="NYSE" at={cue('NYSE')} />
          </Place>

          {(
            [
              {n: 'apple', x: 850, y: 300},
              {n: 'nvidia', x: 1070, y: 300},
              {n: 'microsoft', x: 850, y: 520},
              {n: 'tesla', x: 1070, y: 520},
            ] as const
          ).map((a, i) => (
            <Place key={a.n} x={a.x} y={a.y}>
              <Pop at={i < 2 ? 0.5 + i * 0.2 : cue('например') + (i - 2) * 0.25} out={cue('Список') - 0.3} float phase={i * 1.7}>
                <Avatar name={a.n} size={160} shadow />
              </Pop>
            </Place>
          ))}
          <Sparkles x={960} y={410} radius={300} at={cue('акции')} seed={5} />

          <Place x={960} y={470}>
            <Emphasis pulse={[cue('актуальные')]}>
              <Phone at={cue('Список') - 0.4} width={370}>
                <AppScreen tab={1}>
                  <AppSearch />
                  <AppShortcuts />
                  <AppHeading title="Популярные акции" all />
                  <AppList>
                    <AppRow avatar="apple" title="Apple" subtitle="AAPL" value="231,40 $" change={1.2} at={cue('Список')} />
                    <AppRow avatar="nvidia" title="NVIDIA" subtitle="NVDA" value="142,10 $" change={2.4} at={cue('Список') + 0.15} />
                    <AppRow avatar="microsoft" title="Microsoft" subtitle="MSFT" value="418,00 $" change={-0.6} at={cue('Список') + 0.3} outAt={cue('меняться')} />
                    <AppRow letter="A" tone="accent" title="Amazon" subtitle="AMZN" value="201,70 $" change={0.8} at={cue('Список') + 0.45} />
                    <AppRow avatar="tesla" title="Tesla" subtitle="TSLA" value="338,20 $" change={3.1} at={cue('меняться') + 0.35} selectAt={cue('актуальные')} />
                    <AppRow letter="G" tone="info" title="Alphabet" subtitle="GOOGL" value="176,90 $" change={-0.3} at={cue('поэтому')} />
                  </AppList>
                </AppScreen>
              </Phone>
            </Emphasis>
          </Place>
        </Camera>
      ),
    },
    {
      id: 'company',
      layout: 'free',
      narration:
        'Откройте страницу компании: там можно изучить информацию о ней, посмотреть аналитику и почитать новости. Используйте эти материалы, чтобы лучше понять бизнес, его результаты и события, которые могут повлиять на компанию. Чем больше вы знаете об инструменте, тем увереннее можете оценить, подходит ли он вашим целям.',
      render: ({cue}) => (
        <Camera
          start={{x: 600, y: 420, zoom: 1.4}}
          shots={[
            {at: cue('информацию') - 0.6, x: 960, y: 460, zoom: 1, duration: 1.5},
            {at: cue('Чем') - 0.3, x: 1080, y: 500, zoom: 1.1, duration: 1.8},
          ]}
        >
          <Place x={580} y={470}>
            <Phone at={0.1} width={380}>
              <AppScreen
                toolbar={{trailing: 'bookmark_unclicked'}}
                bottom={<AppButton label="Купить" />}
                scroll={[
                  {at: cue('информацию') - 0.2, y: 300},
                  {at: cue('аналитику') - 0.3, y: 520},
                  {at: cue('новости') - 0.3, y: 680},
                  {at: cue('Используйте') + 0.3, y: 0, duration: 1.4},
                  {at: cue('бизнес') - 0.2, y: 300},
                  {at: cue('результаты') - 0.3, y: 520},
                  {at: cue('события') - 0.3, y: 680},
                ]}
              >
                <AppStockHeader avatar="apple" name="Apple" ticker="AAPL" />
                <AppPills
                  size={16}
                  items={['Обзор', 'О компании', 'Аналитика', 'Новости']}
                  active={[
                    {at: cue('информацию'), index: 1},
                    {at: cue('аналитику'), index: 2},
                    {at: cue('новости'), index: 3},
                    {at: cue('Используйте') + 0.6, index: 0},
                    {at: cue('бизнес'), index: 1},
                    {at: cue('результаты'), index: 2},
                    {at: cue('события'), index: 3},
                  ]}
                />
                <AppPrice price="231,40 $" change="2,75 $ · 1,2%" />
                <AppChart data={priceUp} at={0.5} duration={2} />
                <AppPills items={['Д', 'Н', 'М', '6М', '1Г', 'Все время']} active={2} />
                <AppCard title="О компании AAPL" focusAt={cue('информацию')} focusUntil={cue('аналитику') - 0.3}>
                  <AppLines widths={[100, 94, 72]} />
                  <AppFact label="Сектор" value="Технологии" />
                  <AppFact label="Страна" value="США" />
                  <AppFact label="Класс" value="Акции" />
                </AppCard>
                <AppHeading title="Аналитика" big />
                <AppCard title="Фундаментальный анализ" focusAt={cue('аналитику')} focusUntil={cue('новости') - 0.3}>
                  <AppScale label="Доходность" level="Высокая" value={0.8} ends={['Низкая', 'Высокая']} at={cue('аналитику') + 0.2} />
                  <AppScale label="Риск" level="Средний" value={0.55} ends={['Высокий', 'Низкий']} at={cue('аналитику') + 0.4} />
                  <AppScale label="Мнение аналитиков" level="Покупать" value={0.9} ends={['Продавать', 'Покупать']} at={cue('аналитику') + 0.6} />
                </AppCard>
                <AppHeading title="Новости" all big />
                <AppNews title="Apple представила отчёт за квартал" ticker="AAPL" date="12 ноября" mood="up" />
                <AppNews title="Аналитики обновили прогноз" ticker="AAPL" date="10 ноября" />
              </AppScreen>
            </Phone>
          </Place>

          <Place x={1340} y={200}>
            <Emphasis pulse={[cue('бизнес')]}>
              <Card layout="horizontal" width={500} label="О компании" icon={Buildings} at={cue('информацию')} />
            </Emphasis>
          </Place>
          <Place x={1340} y={385}>
            <Emphasis pulse={[cue('результаты')]}>
              <Card layout="horizontal" width={500} label="Аналитика" icon={ChartBar} tone="info" at={cue('аналитику')} />
            </Emphasis>
          </Place>
          <Place x={1340} y={570}>
            <Emphasis pulse={[cue('события')]}>
              <Card layout="horizontal" width={500} label="Новости" icon={Newspaper} tone="accent" at={cue('новости')} />
            </Emphasis>
          </Place>
          {[200, 385, 570].map((y, i) => (
            <Arrow key={y} from={{x: 800, y: 470}} to={{x: 1070, y}} curve={i === 1 ? 0 : i === 0 ? 40 : -40} at={[cue('информацию'), cue('аналитику'), cue('новости')][i] - 0.3} duration={0.5} tone={(['primary', 'info', 'accent'] as const)[i]} />
          ))}
          <Place x={1340} y={770}>
            <Meter label="Уверенность" icon={Target} from={0.15} to={0.92} at={cue('Чем')} duration={cue('оценить') - cue('Чем') + 0.6} width={500} />
          </Place>
          <Sparkles x={1340} y={770} radius={300} at={cue('оценить')} seed={9} count={6} />
        </Camera>
      ),
    },
    {
      id: 'search',
      layout: 'free',
      narration:
        'Если пока сложно выбрать акции самостоятельно, воспользуйтесь Инвест-поиском: он поможет найти отдельные бумаги по заданным параметрам и фильтрам. Также можно посмотреть готовые подборки и инвестиционные идеи — они помогут сориентироваться и открыть для себя разные варианты.',
      render: ({cue}) => (
        <Camera
          start={{x: 640, y: 460, zoom: 1.13}}
          shots={[
            {at: cue('Также') - 0.5, x: 960, y: 460, zoom: 1, duration: 1.5},
            {at: cue('сориентироваться') - 0.2, x: 1180, y: 470, zoom: 1.1, duration: 2},
          ]}
        >
          <Place x={640} y={470}>
            <Phone at={0.1} width={380}>
              <AppScreen tab={2} scroll={[{at: cue('фильтрам') - 0.5, y: 326}]}>
                <AppNote>Настройте фильтры для поиска ценных бумаг по вашим критериям</AppNote>
                <AppCell icon="filter_vertical" overline="Готовые идеи" headline="Выбрать" trailing="chevron" selectAt={cue('Инвест-поиском')} selectUntil={cue('найти')} />
                <AppCard focusAt={cue('параметрам') - 0.2} focusUntil={cue('фильтрам') - 0.5}>
                  <AppSegments items={['Общая доходность', 'По факторам']} />
                  <AppRange lo={0.5} hi={1} at={cue('заданным')} labels={['Средняя', 'Высокая']} />
                </AppCard>
                <AppCard>
                  <AppSegments items={['Общий риск', 'Факторы риска']} />
                  <AppRange lo={0} hi={0.5} at={cue('параметрам')} labels={['Низкий', 'Средний']} />
                </AppCard>
                <AppCard title="Капитализация">
                  <AppChecks items={[{label: 'Малые'}, {label: 'Средние'}, {label: 'Крупные', checkAt: cue('фильтрам')}]} />
                </AppCard>
                <AppCard title="Секторы">
                  <AppChips items={[{label: 'Технологии', activeAt: cue('фильтрам') + 0.25}, {label: 'Финансы'}, {label: 'Здоровье'}, {label: 'Энергетика'}]} more="Все" />
                </AppCard>
                <Row gap={8}>
                  <AppButton label="Сбросить" kind="secondary" />
                  <AppButton label="Показать 24" pressAt={cue('фильтрам') + 0.9} />
                </Row>
              </AppScreen>
              <AppScreen enterAt={cue('фильтрам') + 1.2} toolbar={{title: 'Найдено 24', trailing: 'filter_funnel'}}>
                <AppChips items={[]} more="Параметры" />
                <AppList>
                  <AppRow avatar="nvidia" title="NVIDIA" subtitle="NVDA" value="9,1 /10" sub="Потенциал +18,4%" at={cue('фильтрам') + 1.5} />
                  <AppRow avatar="microsoft" title="Microsoft" subtitle="MSFT" value="8,7 /10" sub="Потенциал +12,3%" at={cue('фильтрам') + 1.62} />
                  <AppRow avatar="apple" title="Apple" subtitle="AAPL" value="8,4 /10" sub="Потенциал +9,6%" at={cue('фильтрам') + 1.74} />
                  <AppRow letter="G" tone="info" title="Alphabet" subtitle="GOOGL" value="8,2 /10" sub="Потенциал +11,0%" at={cue('фильтрам') + 1.86} />
                  <AppRow letter="A" tone="accent" title="Amazon" subtitle="AMZN" value="7,9 /10" sub="Потенциал +14,2%" at={cue('фильтрам') + 1.98} />
                  <AppRow avatar="tesla" title="Tesla" subtitle="TSLA" value="7,1 /10" sub="Потенциал +6,8%" at={cue('фильтрам') + 2.1} />
                  <AppRow letter="M" tone="info" title="Meta" subtitle="META" value="7,0 /10" sub="Потенциал +8,1%" at={cue('фильтрам') + 2.22} />
                  <AppRow letter="V" tone="primary" title="Visa" subtitle="V" value="6,8 /10" sub="Потенциал +5,5%" at={cue('фильтрам') + 2.34} />
                </AppList>
              </AppScreen>
            </Phone>
          </Place>
          {[
            {x: 250, y: 250},
            {x: 1010, y: 300},
          ].map((q, i) => (
            <Place key={i} x={q.x} y={q.y}>
              <Pop at={cue('сложно') + i * 0.3} out={cue('Инвест-поиском')} float phase={i * 2}>
                <Icon icon={Question} size={70} tone="accent" badge />
              </Pop>
            </Place>
          ))}
          <Place x={250} y={300}>
            <Pop at={cue('Инвест-поиском')} float>
              <Icon icon={MagnifyingGlass} size={110} badge />
            </Pop>
          </Place>
          <Place x={250} y={600}>
            <Pop at={cue('параметрам')} float phase={2}>
              <Icon icon={SlidersHorizontal} size={90} tone="info" badge />
            </Pop>
          </Place>
          <Place x={1010} y={560}>
            <Pop at={cue('фильтрам')} out={cue('Также')} float phase={4}>
              <Icon icon={Funnel} size={80} tone="accent" badge />
            </Pop>
          </Place>

          <Place x={1210} y={330}>
            <Emphasis pulse={[cue('сориентироваться')]}>
              <Tile at={cue('готовые')} width={300} rotate={-4} title="Технологии">
                <AvatarStack names={['apple', 'nvidia', 'microsoft']} />
                <Sparkline data={priceUp} width={240} height={80} at={cue('готовые') + 0.3} />
              </Tile>
            </Emphasis>
          </Place>
          <Place x={1560} y={360}>
            <Emphasis pulse={[cue('сориентироваться') + 0.3]}>
              <Tile at={cue('подборки')} width={300} rotate={3} title="Дивиденды" tone="positive">
                <AvatarStack names={['microsoft', 'apple']} />
                <Sparkline data={calm} width={240} height={80} tone="positive" at={cue('подборки') + 0.3} />
              </Tile>
            </Emphasis>
          </Place>
          <Place x={1390} y={680}>
            <Emphasis pulse={[cue('сориентироваться') + 0.6]}>
              <Tile at={cue('идеи') - 0.3} width={300} rotate={-1} title="Идея" tone="accent">
                <AvatarStack names={['tesla', 'nvidia']} />
                <Sparkline data={wild} width={240} height={80} tone="accent" at={cue('идеи')} />
              </Tile>
            </Emphasis>
          </Place>
          <Place x={1640} y={640}>
            <Pop at={cue('идеи')} float phase={1}>
              <Icon icon={Lightbulb} size={84} tone="accent" badge />
            </Pop>
          </Place>
          <Sparkles x={1400} y={470} radius={430} at={cue('идеи') + 0.3} seed={11} />
        </Camera>
      ),
    },
    {
      id: 'constructor',
      layout: 'free',
      narration:
        'А если хотите собрать портфель под свои параметры, воспользуйтесь конструктором. Укажите сумму, выберите цель и срок, настройте желаемые уровни риска и доходности и другие фильтры — MInvest подберёт бумаги по этим условиям. Изучите состав подборки и долю каждого актива, чтобы понять, как портфель соответствует вашему плану.',
      render: ({cue}) => (
        <Camera
          start={{x: 1100, y: 460, zoom: 1.12}}
          shots={[
            {at: cue('Укажите') - 0.6, x: 800, y: 460, zoom: 1.08, duration: 1.4},
            {at: cue('подберёт') - 0.5, x: 1080, y: 460, zoom: 1.04, duration: 1.6},
            {at: cue('соответствует') - 0.3, x: 960, y: 460, zoom: 1, duration: 1.8},
          ]}
        >
          <Place x={530} y={470}>
            <Phone at={0.3} width={380}>
              <AppScreen
                toolbar={{title: 'Собрать портфель'}}
                bottom={<AppButton label="Подобрать" pressAt={cue('подберёт') - 0.3} />}
                scroll={[
                  {at: cue('настройте') - 0.2, y: 200},
                  {at: cue('другие') - 0.2, y: 340},
                ]}
              >
                <AppCell cash overline="Денежные средства" headline="2 500,00 $" radius={28} />
                <AppAmount label="На сумму" value={1000} at={cue('сумму')} chips={['1 000 $', '5 000 $', '10 000 $', '25 000 $']} chipAt={cue('сумму') + 0.2} />
                <AppCell icon="portfolio_builder_goal" overline="Цель" headline="Баланс риска и доходности" trailing="chevron" selectAt={cue('цель')} selectUntil={cue('настройте')} />
                <AppCell icon="filter_vertical" overline="Готовые идеи" headline="Выбрать" trailing="chevron" />
                <AppCell icon="portfolio_builder_analysts" headline="Учитывать мнение аналитиков" trailing="switch" switchAt={cue('срок')} />
                <AppCard focusAt={cue('доходности')} focusUntil={cue('другие')}>
                  <AppSegments items={['Общая доходность', 'По факторам']} />
                  <AppRange lo={0.45} hi={1} at={cue('доходности')} labels={['Средняя', 'Высокая']} />
                </AppCard>
                <AppCard focusAt={cue('риска')} focusUntil={cue('доходности')}>
                  <AppSegments items={['Общий риск', 'Факторы риска']} />
                  <AppRange lo={0} hi={0.55} at={cue('риска')} labels={['Низкий', 'Средний']} />
                </AppCard>
                <AppCard title="Капитализация">
                  <AppChecks items={[{label: 'Малые'}, {label: 'Средние', checkAt: cue('фильтры') + 0.2}, {label: 'Крупные', checkAt: cue('фильтры')}]} />
                </AppCard>
                <AppCard title="Секторы">
                  <AppChips items={[{label: 'Технологии', activeAt: cue('фильтры') + 0.4}, {label: 'Финансы'}, {label: 'Здоровье', activeAt: cue('фильтры') + 0.6}]} more="Все" />
                </AppCard>
              </AppScreen>
              <AppScreen
                enterAt={cue('подберёт') + 0.2}
                toolbar={{title: 'Ваш портфель'}}
                bottom={<AppButton label="Купить портфель" />}
                scroll={[{at: cue('состав') - 0.3, y: 170}]}
              >
                <AppAmount label="Стоимость портфеля" value={1000} at={cue('подберёт') + 0.4} align="left" />
                <AppCard>
                  <AppFact label="Риск" value="Умеренный" />
                  <AppFact label="Доходность" value="Выше средней" />
                </AppCard>
                <AppHeading title="Состав" />
                <AppList>
                  {(
                    [
                      {a: 'apple', n: 'Apple', tk: 'AAPL', w: 30, q: '1,3 шт. · 300 $'},
                      {a: 'nvidia', n: 'NVIDIA', tk: 'NVDA', w: 25, q: '1,8 шт. · 250 $'},
                      {a: 'microsoft', n: 'Microsoft', tk: 'MSFT', w: 20, q: '0,5 шт. · 200 $'},
                      {a: 'tesla', n: 'Tesla', tk: 'TSLA', w: 15, q: '0,4 шт. · 150 $'},
                    ] as const
                  ).map((r, i) => (
                    <AppRow key={r.a} avatar={r.a} title={r.n} subtitle={r.tk} value={`${r.w}%`} sub={r.q} at={cue('подберёт') + 0.6 + i * 0.15}>
                      <AppShareBar value={r.w / 100} at={cue('подберёт') + 0.9 + i * 0.15} />
                    </AppRow>
                  ))}
                </AppList>
              </AppScreen>
            </Phone>
          </Place>

          <Sparkles x={1390} y={450} radius={330} at={0.6} seed={13} />
          <Place x={1390} y={450}>
            <Pop at={0.1} out={cue('подберёт') - 0.2} float bounce="soft">
              <AppImage name="constructor" size={520} round />
            </Pop>
          </Place>
          <Place x={1390} y={460}>
            <Donut
              size={400}
              at={cue('подберёт')}
              stagger={0.32}
              segments={[
                {value: 30, fill: 'primary', avatar: 'apple'},
                {value: 25, fill: 'info', avatar: 'nvidia'},
                {value: 20, fill: 'positive', avatar: 'microsoft'},
                {value: 15, fill: 'accent', avatar: 'tesla'},
                {value: 10, fill: 'gold'},
              ]}
              focus={[0, 1, 2, 3, 4].map((i) => ({
                index: i,
                at: cue('состав') + i * ((cue('чтобы') - cue('состав')) / 5),
                until: cue('состав') + (i + 1) * ((cue('чтобы') - cue('состав')) / 5) + 0.2,
              }))}
            >
              <Pop at={cue('соответствует')} bounce="strong">
                <Icon icon={CheckCircle} size={130} tone="positive" />
              </Pop>
            </Donut>
          </Place>
        </Camera>
      ),
    },
    {
      id: 'crypto',
      layout: 'free',
      narration:
        'В MInvest можно работать не только с ценными бумагами, но и с криптовалютой: покупать, продавать, хранить и переводить цифровые активы, например Bitcoin, Ethereum, Tron и USDT.',
      render: ({cue}) => (
        <Camera
          start={{x: 960, y: 400, zoom: 1.16}}
          shots={[
            {at: cue('покупать') - 0.5, x: 960, y: 470, zoom: 1, duration: 1.3},
            {at: cue('Bitcoin') - 0.5, x: 960, y: 390, zoom: 1.12, duration: 1.4},
          ]}
        >
          <Sparkles x={960} y={320} radius={620} at={cue('криптовалютой')} seed={15} count={10} />
          {(
            [
              {n: 'btc', word: 'Bitcoin'},
              {n: 'eth', word: 'Ethereum'},
              {n: 'trx', word: 'Tron'},
              {n: 'usdt', word: 'USDT'},
            ] as const
          ).map((c, i) => (
            <Place key={c.n} x={390 + i * 380} y={300}>
              <Emphasis pulse={[cue('криптовалютой') + i * 0.15, cue(c.word)]} dim={[[cue('Bitcoin') - 0.2, cue(c.word)]]}>
                <Pop at={0.1 + i * 0.18} float phase={i * 1.5} bounce="strong">
                  <Avatar name={c.n} size={230} shadow />
                </Pop>
              </Emphasis>
            </Place>
          ))}
          {[
            {icon: ShoppingCartSimple, text: 'Купить', word: 'покупать', tone: 'positive' as const},
            {icon: HandCoins, text: 'Продать', word: 'продавать', tone: 'negative' as const},
            {icon: Vault, text: 'Хранить', word: 'хранить', tone: 'primary' as const},
            {icon: PaperPlaneTilt, text: 'Перевести', word: 'переводить', tone: 'primary' as const},
          ].map((a, i) => (
            <Place key={a.word} x={390 + i * 380} y={670}>
              <Emphasis dim={[[cue('Bitcoin') - 0.2, 999]]}>
                <Stack gap={18}>
                  <Pop at={cue(a.word)} bounce="strong">
                    <Icon icon={a.icon} size={96} tone={a.tone} badge />
                  </Pop>
                  <Pill text={a.text} tone={a.tone} at={cue(a.word) + 0.15} />
                </Stack>
              </Emphasis>
            </Place>
          ))}
        </Camera>
      ),
    },
    {
      id: 'crypto-vs-stock',
      layout: 'free',
      narration:
        'Акция и криптовалюта устроены по-разному: акция связана с долей в компании, а криптовалюта — это цифровой актив. Поскольку её стоимость может меняться быстро, полезно заранее решить, какую роль такие активы будут играть в вашем инвестиционном плане.',
      render: ({cue}) => (
        <Camera start={{zoom: 1.06}} shots={[{at: cue('Поскольку') - 0.3, x: 1250, y: 470, zoom: 1.12, duration: 1.5}, {at: cue('полезно') - 0.3, zoom: 1, duration: 1.6}]}>
          <Place x={420} y={470}>
            <Emphasis pulse={[cue('акция', 2)]} dim={[[cue('криптовалюта', 2), cue('полезно')]]}>
              <Panel title="Акция" illustration="pie" at={0.1} width={600}>
                <Illustration name="building" size={250} at={0.3} backdrop="none" />
                <Pill text="Доля в компании" at={cue('долей')} size="md" />
                <Sparkline data={calm} width={480} height={90} at={0.9} duration={2.4} />
              </Panel>
            </Emphasis>
          </Place>
          <Place x={1500} y={470}>
            <Emphasis pulse={[cue('криптовалюта', 2), cue('стоимость'), cue('быстро')]} dim={[[cue('акция', 2), cue('криптовалюта', 2)]]}>
              <Panel title="Криптовалюта" icon={CurrencyBtc} tone="accent" at={0.3} width={600}>
                <Box height={250}>
                  <Pop at={0.5} float bounce="strong">
                    <Avatar name="btc" size={200} shadow />
                  </Pop>
                </Box>
                <Pill text="Цифровой актив" tone="accent" at={cue('цифровой')} size="md" />
                <Sparkline data={wild} width={480} height={90} tone="accent" at={1.1} duration={2.4} />
              </Panel>
            </Emphasis>
          </Place>
          <Place x={960} y={470}>
            <Donut
              size={330}
              labels={false}
              at={cue('решить') - 0.3}
              stagger={0.5}
              segments={[
                {value: 85, fill: 'primary'},
                {value: 15, fill: 'accent'},
              ]}
              focus={[{index: 1, at: cue('роль'), until: cue('инвестиционном')}]}
            >
              <Pop at={cue('роль')} bounce="strong">
                <Icon icon={Question} size={96} tone="accent" />
              </Pop>
            </Donut>
          </Place>
        </Camera>
      ),
    },
    {
      id: 'orders',
      layout: 'free',
      narration:
        'Когда вы выбрали актив, можно отправить заявку на покупку. В MInvest доступны разные типы ордеров: рыночный, лимитный, стоп-ордер и стоп-лимитный. Они помогают задавать разные условия для сделки — например, указать цену или уровень, при котором заявка станет активной. Эти варианты мы разберём в отдельном уроке.',
      render: ({cue}) => {
        const tiles = [
          {name: 'order-market', text: 'Рыночный', at: cue('рыночный'), x: 1010, y: 265, pulse: [] as number[]},
          {name: 'order-limit', text: 'Лимитный', at: cue('лимитный'), x: 1450, y: 265, pulse: [cue('цену')]},
          {name: 'order-stop', text: 'Стоп', at: cue('стоп'), x: 1010, y: 665, pulse: [cue('уровень')]},
          {name: 'order-stop-limit', text: 'Стоп-лимит', at: cue('стоп-лимитный'), x: 1450, y: 665, pulse: [cue('уровень') + 0.25]},
        ] as const;
        return (
          <Camera
            start={{x: 560, y: 470, zoom: 1.13}}
            shots={[
              {at: cue('доступны') - 0.6, x: 960, y: 460, zoom: 1, duration: 1.5},
              {at: cue('Они') - 0.2, x: 1180, y: 460, zoom: 1.1, duration: 1.8},
              {at: cue('Эти') - 0.2, x: 960, y: 460, zoom: 1, duration: 1.8},
            ]}
          >
            <Place x={440} y={470}>
              <Phone at={0.1} width={370}>
                <AppScreen toolbar={{title: 'Покупка AAPL', subtitle: 'Рыночный ордер'}} bottom={<AppButton label="Продолжить" pressAt={cue('заявку')} />}>
                  <AppCell cash overline="Денежные средства" headline="2 500,00 $" right={['Доступно акций', '≈10 шт.']} radius={28} />
                  <AppCell avatar="apple" overline="NASDAQ" headline="Apple" right={['Текущая цена', '231,40 $']} radius={28} selectAt={cue('выбрали')} selectUntil={cue('можно') + 0.6} />
                  <AppInput label="Тип ордера" value="Рыночный ордер" selector focusAt={cue('доступны') - 1} focusUntil={cue('доступны')} />
                  <AppInput label="На сумму" value="100,00" suffix="$" />
                  <AppInput label="Количество" value="0,43" suffix="шт." />
                  <AppCard>
                    <AppFact label="Комиссия" value="0,30 $" />
                    <AppFact label="Итого" value="100,30 $" />
                  </AppCard>
                </AppScreen>
                <AppScreen enterAt={cue('доступны') - 0.3} toolbar={{title: 'Тип ордера'}}>
                  <AppCell image="order-market" headline="Рыночный ордер" supporting="Покупаете по рыночной цене" trailing="info" selectAt={cue('рыночный')} selectUntil={cue('лимитный')} />
                  <AppCell image="order-limit" headline="Лимитный ордер" supporting="Ордер на покупку по указанной цене или ниже" trailing="info" selectAt={cue('лимитный')} selectUntil={cue('стоп')} />
                  <AppCell image="order-stop" headline="Стоп ордер" supporting="Если цена поднялась до активного уровня, покупается по рыночной цене" trailing="info" selectAt={cue('стоп')} selectUntil={cue('стоп-лимитный')} />
                  <AppCell image="order-stop-limit" headline="Стоп-лимитный ордер" supporting="Если цена поднялась до активного уровня, выставим лимитную цену на покупку" trailing="info" selectAt={cue('стоп-лимитный')} selectUntil={cue('Они')} />
                </AppScreen>
              </Phone>
            </Place>
            <Fly from={{x: 560, y: 690}} to={{x: 900, y: 420}} curve={-120} at={cue('заявку') + 0.1} duration={1.1} orient>
              <Icon icon={PaperPlaneTilt} size={90} />
            </Fly>
            {tiles.map((o, i) => (
              <Place key={o.name} x={o.x} y={o.y}>
                <Emphasis pulse={[...o.pulse, cue('Эти') + i * 0.18]}>
                  <Tile at={cue('доступны') - 0.3 + i * 0.12} width={360}>
                    <Pop at={o.at} bounce="strong">
                      <AppImage name={o.name} size={240} radius={36} />
                    </Pop>
                    <Pill text={o.text} at={o.at + 0.15} size="md" />
                  </Tile>
                </Emphasis>
              </Place>
            ))}
            <Sparkles x={1230} y={465} radius={520} at={cue('Эти')} seed={17} count={9} />
          </Camera>
        );
      },
    },
    {
      id: 'goal',
      layout: 'free',
      narration:
        'Перед покупкой полезно сформулировать цель и проверить, насколько выбранный актив или портфель ей соответствует. Подборки, аналитика и новости помогут собрать нужную информацию и принять решение более осознанно.',
      render: ({cue}) => (
        <Camera
          start={{x: 960, y: 440, zoom: 1.35}}
          shots={[
            {at: cue('проверить') - 0.5, x: 1200, y: 450, zoom: 1.1, duration: 1.5},
            {at: cue('Подборки') - 0.5, x: 960, y: 460, zoom: 1, duration: 1.5},
          ]}
        >
          <Sparkles x={960} y={430} radius={280} at={0.6} seed={19} count={6} />
          <Place x={960} y={420}>
            <Emphasis pulse={[cue('цель'), cue('решение')]}>
              <Pop at={0.1} float bounce="strong">
                <Icon icon={Target} size={180} badge />
              </Pop>
            </Emphasis>
          </Place>
          <Place x={960} y={660}>
            <Pill text="Цель" at={cue('цель')} />
          </Place>

          <Place x={1540} y={410}>
            <Emphasis pulse={[cue('портфель')]}>
              <Pop at={cue('проверить') - 0.2} float phase={2} bounce="soft">
                <AppImage name="briefcase" size={430} />
              </Pop>
            </Emphasis>
          </Place>
          <Arrow from={{x: 1330, y: 420}} to={{x: 1140, y: 420}} at={cue('насколько')} tone="positive" />
          <Place x={1570} y={650}>
            <Stamp text="ПОДХОДИТ" at={cue('соответствует')} tone={color.positive} rotate={-8} />
          </Place>

          {[
            {label: 'Подборки', icon: StackIcon, word: 'Подборки', y: 220, tone: 'primary' as const},
            {label: 'Аналитика', icon: ChartBar, word: 'аналитика', y: 420, tone: 'info' as const},
            {label: 'Новости', icon: Newspaper, word: 'новости', y: 620, tone: 'accent' as const},
          ].map((s, i) => (
            <React.Fragment key={s.word}>
              <Place x={330} y={s.y}>
                <Card layout="horizontal" width={420} label={s.label} icon={s.icon} tone={s.tone} at={cue(s.word)} />
              </Place>
              <Arrow from={{x: 560, y: s.y}} to={{x: 790, y: 420 + (i - 1) * 50}} curve={(i - 1) * -30} tone={s.tone} at={cue(s.word) + 0.2} duration={0.5} />
            </React.Fragment>
          ))}
        </Camera>
      ),
    },
    {
      id: 'summary',
      narration:
        'Итак, MInvest помогает изучать компании и инструменты, искать идеи, собирать портфель и совершать операции с ценными бумагами и криптовалютой.',
      render: ({cue}) => (
        <Row gap={50}>
          <Emphasis dim={[[-1, cue('изучать')]]} pulse={[cue('изучать')]}>
            <Stack gap={20}>
              <Illustration name="building" size={340} at={0.1} />
              <Pill text="Изучать" at={0.3} />
            </Stack>
          </Emphasis>
          <Emphasis dim={[[-1, cue('искать')]]} pulse={[cue('искать')]}>
            <Stack gap={20}>
              <Box width={340} height={340}>
                <Pop at={0.25} float phase={1}>
                  <Icon icon={Lightbulb} size={170} tone="accent" badge />
                </Pop>
              </Box>
              <Pill text="Идеи" tone="accent" at={0.45} />
            </Stack>
          </Emphasis>
          <Emphasis dim={[[-1, cue('собирать')]]} pulse={[cue('собирать')]}>
            <Stack gap={20}>
              <Illustration name="pie" size={340} at={0.4} phase={2} />
              <Pill text="Портфель" at={0.6} />
            </Stack>
          </Emphasis>
          <Emphasis dim={[[-1, cue('совершать')]]} pulse={[cue('совершать'), cue('криптовалютой')]}>
            <Stack gap={20}>
              <Pop at={0.55} float phase={3} bounce="soft">
                <AppImage name="coins-ring" size={340} />
              </Pop>
              <Pill text="Сделки" at={0.75} />
            </Stack>
          </Emphasis>
        </Row>
      ),
    },
    {
      id: 'next',
      layout: 'free',
      minDuration: 7.5,
      narration: 'А в следующих уроках мы шаг за шагом разберём, как устроены рынок, счёт и сделки.',
      render: ({cue}) => {
        const steps = [
          {label: 'Рынок', name: 'growth', word: 'рынок', tone: 'primary'},
          {label: 'Счёт', name: 'wallet', word: 'счёт', tone: 'primary'},
          {label: 'Сделки', name: 'hand-coin', word: 'сделки', tone: 'primary'},
        ] as const;
        return (
          // Три объёмные «остановки» будущих уроков; между ними бегут монеты, камера медленно наезжает
          <Camera start={{zoom: 0.94}} shots={[{at: 0.2, y: 480, zoom: 1.06, duration: 5}]}>
            <Sparkles x={960} y={420} radius={760} at={0.8} seed={21} count={14} />
            {steps.map((s, i) => (
              <React.Fragment key={s.word}>
                <Place x={380 + i * 580} y={400}>
                  <Emphasis pulse={[cue('шаг') + i * 0.35, cue(s.word)]}>
                    <Illustration name={s.name} size={430} at={0.1 + i * 0.3} phase={i * 1.8} />
                  </Emphasis>
                </Place>
                <Place x={380 + i * 580} y={690}>
                  <Pill text={s.label} tone={s.tone} at={cue(s.word)} />
                </Place>
                {i < 2 ? (
                  <Arrow
                    from={{x: 600 + i * 580, y: 400}}
                    to={{x: 740 + i * 580, y: 400}}
                    curve={30}
                    at={cue('шаг') + i * 0.45}
                    duration={0.5}
                    flow={{every: 0.5, travel: 0.9}}
                  />
                ) : null}
              </React.Fragment>
            ))}
            <Fly from={{x: 380, y: 130}} to={{x: 1540, y: 130}} curve={-70} at={cue('шаг') - 0.2} duration={cue('рынок') - cue('шаг') + 0.2}>
              <LogoMark size={100} />
            </Fly>
            <Place x={960} y={830}>
              <Pop at={cue('сделки') + 0.5} bounce="soft">
                <Logo height={76} />
              </Pop>
            </Place>
          </Camera>
        );
      },
    },
  ],
};
