// Публичный словарь UI kit. Сцены уроков импортируют элементы ТОЛЬКО отсюда.
export * from './tokens';
export {fontFamily} from './fonts';
export {useEnter, useProgress, useBounce, useTime, useClock, springAt, easeAt, enterStyle, popStyle, bounceStyle} from './anim';
export {estimateCaptions, findWordMs} from './captions';
export {buildLesson, LessonVideo, type Lesson, type LessonScene, type SceneCtx} from './lesson';

// Каркас
export {LessonFrame} from './layout/LessonFrame';
export {Subtitles} from './layout/Subtitles';
export {Scene, Place} from './layout/Scene';
export {Camera, type CameraShot} from './layout/Camera';
export {Emphasis} from './layout/Emphasis';
export {Background} from './layout/Background';

// Текст
export {Title} from './text/Title';
export {BulletList} from './text/BulletList';
export {Term} from './text/Term';
export {KineticText} from './text/KineticText';
export {Pill} from './text/Pill';

// Схемы
export {Card} from './diagram/Card';
export {Arrow, curvePath, type FlowOptions} from './diagram/Arrow';
export {Chain} from './diagram/Chain';
export {Orbit, Scatter, Fly, Tile} from './diagram/Motion';

// Сравнения
export {TwoColumns} from './compare/TwoColumns';
export {Panel, Row, Stack, Box} from './compare/Panel';

// Цифры и графики
export {BigNumber} from './data/BigNumber';
export {LineChart} from './data/LineChart';
export {CashFlow, type Flow} from './data/CashFlow';
export {Gauge} from './data/Gauge';
export {Sparkline} from './data/Sparkline';
export {Donut} from './data/Donut';
export {ControlCard, ControlRow, Slider, Choice, Counter, Meter} from './data/Controls';

// Картинки
export {Icon} from './media/Icon';
export {Coin, type CoinKind} from './media/Coin';
export {Illustration, type IllustrationName} from './media/Illustration';
export {Sparkles} from './media/Sparkles';
export {Stamp} from './media/Stamp';
export {Document} from './media/Document';
export {Logo, LogoMark, MbankTile, brandGradient} from './media/Logo';
export {Pop} from './media/Pop';
export {Avatar, AvatarStack, AppImage, type AvatarName, type AppImageName} from './media/Asset';

// Телефон и экраны приложения
export {Phone} from './app/Phone';
export {
  AppScreen,
  AppTabBar,
  AppIcon,
  AppSplash,
  AppSearch,
  AppShortcuts,
  AppHeading,
  AppCard,
  AppRow,
  AppList,
  AppShareBar,
  AppChips,
  AppPills,
  AppSegments,
  AppChart,
  AppStockHeader,
  AppPrice,
  AppLines,
  AppFact,
  AppScale,
  AppNews,
  AppButton,
  AppCell,
  AppInput,
  AppAmount,
  AppRange,
  AppChecks,
  AppNote,
} from './app/AppUi';

// Навигация
export {LessonIntro} from './nav/LessonIntro';
