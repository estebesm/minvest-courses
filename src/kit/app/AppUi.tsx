import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import {scaleLinear} from 'd3-scale';
import {area, line} from 'd3-shape';
import React from 'react';
import {Img, staticFile} from 'remotion';
import {easeAt, springAt, useClock, windowAt} from '../anim';
import {Avatar, type AvatarName} from '../media/Asset';
import {LogoMark} from '../media/Logo';
import {color, weight, type Tone} from '../tokens';
import {SCREEN} from './Phone';

/**
 * Экраны приложения для показа внутри <Phone>.
 * Размеры, цвета и подписи сняты с кода minvest-app (lib/src/shared/view/components и экраны feature/*):
 * серый фон #F3F3F6, белые карточки r20–28, кнопки h64 r20, «стеклянные» кнопки и нижнее меню.
 * Вёрстка — в px макета (экран 390×844).
 */

const kick = (p: number, amount: number) => 1 + Math.sin(Math.min(1, Math.max(0, p)) * Math.PI) * amount;
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(1).replace('.', ',')}%`;

/** Значок из приложения (public/app/icons — копии assets/icons). */
export const AppIcon: React.FC<{name: string; size?: number; opacity?: number}> = ({name, size = 24, opacity = 1}) => (
  <Img src={staticFile(`app/icons/${name}.svg`)} style={{width: size, height: size, display: 'block', flexShrink: 0, opacity}} />
);

const glassButton: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 22,
  background: 'rgba(255,255,255,0.7)',
  boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.95), 0 4px 8px rgba(0,0,0,0.04)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/** Нижнее меню — как в приложении (home_tab_bar.dart): значки из assets/icons/main, подписи из app_ru.arb */
const TABS = [
  {icon: 'home', selected: 'home_selected', label: 'Главная'},
  {icon: 'chart-up', selected: 'selected-chart-up', label: 'Каталог'},
  {icon: 'search-analysis', selected: 'search_analysis_selected', label: 'Скринер'},
  {icon: 'menu', selected: 'menu', label: 'Меню'},
] as const;

/** «Стеклянная» плавающая панель вкладок (AppGlassTabBar): высота 64, под выбранной вкладкой — тёмная «таблетка». */
export const AppTabBar: React.FC<{active: number}> = ({active}) => (
  <div
    style={{
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 26,
      height: 64,
      borderRadius: 32,
      background: 'rgba(255,255,255,0.82)',
      backdropFilter: 'blur(18px) saturate(1.2)',
      boxShadow: '0 8px 28px rgba(26,27,31,0.14), inset 0 0 0 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(26,27,31,0.05)',
      display: 'flex',
      padding: 4,
      boxSizing: 'border-box',
    }}
  >
    {TABS.map((tab, i) => (
      <div
        key={tab.icon}
        style={{
          flex: 1,
          borderRadius: 28,
          background: i === active ? 'rgba(0,0,0,0.12)' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          fontSize: 10,
          lineHeight: 1,
          fontWeight: i === active ? weight.semibold : weight.regular,
          color: color.ink,
        }}
      >
        <AppIcon name={i === active ? tab.selected : tab.icon} />
        {tab.label}
      </div>
    ))}
  </div>
);

type ScrollKey = {at: number; y: number; duration?: number};

type ScreenProps = {
  /** Верхняя панель с кнопкой «назад» и заголовком по центру (AppToolbar.small) */
  toolbar?: {title?: string; subtitle?: string; trailing?: string};
  /** Активная вкладка нижнего меню: 0 Главная, 1 Каталог, 2 Скринер, 3 Меню */
  tab?: number;
  /** Закреплённая нижняя панель (кнопки «Продать / Купить» и т. п.) */
  bottom?: React.ReactNode;
  /** Прокрутка экрана по ходу сцены */
  scroll?: ScrollKey[];
  /** Экран «въезжает» справа поверх предыдущего — переход вглубь приложения */
  enterAt?: number;
  children?: React.ReactNode;
};

/** Экран приложения: серый фон, панель сверху, содержимое с прокруткой, меню или кнопки снизу. */
export const AppScreen: React.FC<ScreenProps> = ({toolbar, tab, bottom, scroll = [], enterAt, children}) => {
  const {t} = useClock();
  let y = 0;
  for (const k of scroll) y += (k.y - y) * easeAt(t, k.at, k.duration ?? 0.9);
  const p = enterAt === undefined ? 1 : easeAt(t, enterAt, 0.5);
  if (p <= 0) return null;
  const top = SCREEN.statusBar + (toolbar ? 60 : 0);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: color.surface,
        transform: p < 1 ? `translate3d(${(1 - p) * 100}%, 0, 0)` : undefined,
        boxShadow: p < 1 ? '-20px 0 40px rgba(26,27,31,0.12)' : undefined,
      }}
    >
      <div style={{position: 'absolute', left: 0, right: 0, top, bottom: 0, overflow: 'hidden'}}>
        <div
          style={{
            padding: `8px 20px ${tab === undefined ? 150 : 130}px`,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transform: `translate3d(0, ${-y}px, 0)`,
          }}
        >
          {children}
        </div>
      </div>
      {toolbar ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: top,
            padding: `${SCREEN.statusBar + 8}px 16px 8px`,
            boxSizing: 'border-box',
            background: color.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={glassButton}>
            <AppIcon name="chevron_left" size={18} />
          </div>
          <div style={{position: 'absolute', left: 70, right: 70, bottom: 8, height: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2}}>
            <div style={{fontSize: 16, fontWeight: weight.semibold}}>{toolbar.title}</div>
            {toolbar.subtitle ? <div style={{fontSize: 12, fontWeight: weight.medium, color: color.info}}>{toolbar.subtitle}</div> : null}
          </div>
          {toolbar.trailing ? (
            <div style={glassButton}>
              <AppIcon name={toolbar.trailing} />
            </div>
          ) : (
            <div style={{width: 44}} />
          )}
        </div>
      ) : null}
      {bottom ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: color.card,
            borderRadius: '28px 28px 0 0',
            boxShadow: '0 -8px 8px rgba(0,0,0,0.05)',
            padding: '16px 20px 30px',
            display: 'flex',
            gap: 12,
          }}
        >
          {bottom}
        </div>
      ) : null}
      {tab === undefined ? null : <AppTabBar active={tab} />}
    </div>
  );
};

/** Заставка приложения: знак на фирменном фоне. `out` — когда раствориться и показать экран под ней. */
export const AppSplash: React.FC<{at?: number; out?: number}> = ({at = 0, out}) => {
  const {frame, fps, t} = useClock();
  const left = springAt(frame, fps, at + 0.25);
  const right = springAt(frame, fps, at + 0.45);
  const po = out === undefined ? 0 : easeAt(t, out, 0.5);
  const ring = ((t - at) % 2.2) / 2.2;
  if (po >= 1) return null;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(170deg, ${color.primaryGlow} 0%, ${color.primarySoft} 45%, ${color.surface} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - po,
        transform: `scale(${1 + po * 0.08})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 190,
          height: 190,
          borderRadius: '50%',
          border: `3px solid ${color.primaryLight}`,
          opacity: (1 - ring) * 0.5,
          transform: `scale(${1 + ring * 1.1})`,
        }}
      />
      <div style={{width: 190, height: 190, borderRadius: 54, background: color.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 50px rgba(110,57,221,0.25)'}}>
        <LogoMark size={120} left={left} right={right} />
      </div>
    </div>
  );
};

/** Строка поиска каталога (market_header.dart): белая «таблетка», «Поиск акции». Текст печатается с `at`. */
export const AppSearch: React.FC<{text?: string; at?: number}> = ({text = '', at = 0}) => {
  const {t} = useClock();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * 11)));
  const caret = t > at && Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{height: 44, borderRadius: 16, background: color.card, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px', fontSize: 14, boxShadow: n ? `0 0 0 2px ${color.primary}` : undefined}}>
      <AppIcon name="auth_country_search" opacity={0.6} />
      {n ? <span style={{color: color.ink}}>{text.slice(0, n)}</span> : <span style={{color: color.inkSoft}}>Поиск акции</span>}
      {n ? <span style={{width: 1.5, height: 20, marginLeft: -6, background: color.inkMuted, opacity: caret ? 1 : 0}} /> : null}
    </div>
  );
};

/** Две карточки-ярлыка каталога: «Избранное» и «Инвест поиск» (market_shortcuts.dart). */
export const AppShortcuts: React.FC<{focusAt?: number; focusUntil?: number}> = ({focusAt, focusUntil}) => {
  const {t} = useClock();
  const f = focusAt === undefined ? 0 : windowAt(t, focusAt, focusUntil ?? focusAt + 1.6);
  return (
    <div style={{display: 'flex', gap: 8}}>
      {[
        {icon: 'bookmark', label: 'Избранное', on: 0},
        {icon: 'invest_search', label: 'Инвест поиск', on: f},
      ].map((c) => (
        <div key={c.label} style={{flex: 1, background: color.card, borderRadius: 28, padding: 16, boxShadow: `0 0 0 ${2.5 * c.on}px ${color.primary}`, transform: `scale(${1 + 0.03 * c.on})`}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <AppIcon name={c.icon} size={28} />
            <AppIcon name="chevron_right" size={20} />
          </div>
          <div style={{marginTop: 12, fontSize: 16, fontWeight: weight.medium}}>{c.label}</div>
        </div>
      ))}
    </div>
  );
};

/** Заголовок раздела: 22/700 и ссылка «Все» справа. `big` — заголовок секции страницы компании (24/700). */
export const AppHeading: React.FC<{title: string; all?: boolean; big?: boolean}> = ({title, all = false, big = false}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0 0'}}>
    <div style={{fontSize: big ? 24 : 22, fontWeight: weight.bold, lineHeight: '28px'}}>{title}</div>
    {all ? <div style={{fontSize: 16, fontWeight: weight.semibold, color: color.primary}}>Все</div> : null}
  </div>
);

/** Карточка-секция (MarketSurfaceCard): r28, фон #F9F9FC, белая рамка. `focusAt` — обвести, когда о ней говорят. */
export const AppCard: React.FC<{title?: string; subtitle?: string; focusAt?: number; focusUntil?: number; white?: boolean; children?: React.ReactNode}> = ({
  title,
  subtitle,
  focusAt,
  focusUntil,
  white = false,
  children,
}) => {
  const {t} = useClock();
  const f = focusAt === undefined ? 0 : windowAt(t, focusAt, focusUntil ?? focusAt + 1.6);
  return (
    <div
      style={{
        background: white ? color.card : color.surfaceLow,
        border: `1px solid ${color.card}`,
        borderRadius: 28,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: `0 0 0 ${3 * f}px ${color.primary}`,
        transform: `scale(${1 + 0.02 * f})`,
      }}
    >
      {title ? (
        <div>
          <div style={{fontSize: 18, fontWeight: weight.bold, lineHeight: '24px'}}>{title}</div>
          {subtitle ? <div style={{fontSize: 14, color: color.inkSoft, marginTop: 4}}>{subtitle}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};

type RowProps = {
  avatar?: AvatarName;
  letter?: string;
  tone?: Tone;
  title: string;
  subtitle?: string;
  value?: string;
  /** Изменение цены, % (зелёным или розовым) */
  change?: number;
  /** Произвольная нижняя подпись справа вместо процента */
  sub?: string;
  /** Фон строки: белый (на сером экране) или мягкий (внутри белого листа) */
  soft?: boolean;
  at?: number;
  outAt?: number;
  selectAt?: number;
  children?: React.ReactNode;
};

/** Строка акции (StockTile): белая карточка h64 r20, логотип 40, название и тикер, справа цена и изменение. */
export const AppRow: React.FC<RowProps> = ({avatar, letter, tone, title, subtitle, value, change, sub, soft = false, at = 0, outAt, selectAt, children}) => {
  const {frame, fps, t} = useClock();
  const p = springAt(frame, fps, at, 'soft');
  const po = outAt === undefined ? 0 : easeAt(t, outAt, 0.45);
  const sel = selectAt === undefined ? 0 : springAt(frame, fps, selectAt, 'strong');
  const grow = Math.min(1, Math.max(0, p) * 1.6) * (1 - po);
  const h = children ? 88 : 64;
  return (
    <div style={{height: (h + 4) * grow, opacity: Math.min(1, Math.max(0, p) * 2) * (1 - po), transform: `translate3d(${(1 - p) * 50 - po * 80}px, 0, 0)`}}>
      <div
        style={{
          height: h,
          borderRadius: 20,
          background: soft ? color.surfaceLow : color.card,
          boxShadow: sel > 0.5 ? `inset 0 0 0 2px ${color.primary}` : undefined,
          padding: 12,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 10,
          transform: `scale(${kick(sel, 0.05)})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <Avatar name={avatar} letter={letter} tone={tone} size={40} />
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: 16, fontWeight: weight.semibold, whiteSpace: 'nowrap', lineHeight: '20px'}}>{title}</div>
            {subtitle ? <div style={{fontSize: 14, fontWeight: weight.medium, color: color.inkSoft, lineHeight: '18px', marginTop: 2}}>{subtitle}</div> : null}
          </div>
          <div style={{textAlign: 'right'}}>
            {value ? <div style={{fontSize: 16, fontWeight: weight.semibold, fontVariantNumeric: 'tabular-nums', lineHeight: '20px', whiteSpace: 'nowrap'}}>{value}</div> : null}
            {change === undefined ? null : (
              <div style={{fontSize: 14, fontWeight: weight.medium, color: change >= 0 ? color.positive : color.negative, lineHeight: '18px', marginTop: 2}}>{pct(change)}</div>
            )}
            {sub ? <div style={{fontSize: 14, fontWeight: weight.medium, color: color.inkSoft, lineHeight: '18px', marginTop: 2, whiteSpace: 'nowrap'}}>{sub}</div> : null}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

/** Список строк: зазор 4 px сидит внутри AppRow, чтобы строки плавно схлопывались. */
export const AppList: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{display: 'flex', flexDirection: 'column', marginBottom: -4}}>{children}</div>;

/** Полоска доли актива в портфеле (экран «Ваш портфель»). */
export const AppShareBar: React.FC<{value: number; at?: number}> = ({value, at = 0}) => {
  const {t} = useClock();
  return (
    <div style={{height: 8, borderRadius: 8, background: color.outline, overflow: 'hidden'}}>
      <div style={{height: 8, borderRadius: 8, width: `${value * 100 * easeAt(t, at, 0.8)}%`, background: color.primary}} />
    </div>
  );
};

/** Чипсы-переключатели (AppToggleChip): невыбранный серый, выбранный — тёмный. */
export const AppChips: React.FC<{items: {label: string; activeAt?: number}[]; more?: string}> = ({items, more}) => {
  const {frame, fps} = useClock();
  return (
    <div style={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
      {items.map((c) => {
        const p = c.activeAt === undefined ? 0 : springAt(frame, fps, c.activeAt, 'strong');
        const on = p > 0.5;
        return (
          <div
            key={c.label}
            style={{
              padding: '8px 12px',
              borderRadius: 20,
              fontSize: 14,
              fontWeight: weight.medium,
              whiteSpace: 'nowrap',
              background: on ? color.ink : color.surfaceDim,
              color: on ? color.surfaceLow : color.ink,
              transform: `scale(${kick(p, 0.14)})`,
            }}
          >
            {c.label}
          </div>
        );
      })}
      {more ? (
        <div style={{padding: '8px 12px', borderRadius: 24, fontSize: 14, fontWeight: weight.medium, background: color.primarySoft, color: color.primary, display: 'flex', gap: 4, alignItems: 'center'}}>
          <AppIcon name="dropdown_chevron" size={20} />
          {more}
        </div>
      ) : null}
    </div>
  );
};

/** Вкладки-«пилюли» (AppChipTabs): разделы страницы компании и периоды графика. Выбранная — тёмная. */
export const AppPills: React.FC<{items: string[]; active?: number | {at: number; index: number}[]; size?: number}> = ({items, active = 0, size = 14}) => {
  const {t} = useClock();
  const idx = typeof active === 'number' ? active : active.reduce((a, k) => (t >= k.at ? k.index : a), 0);
  return (
    <div style={{display: 'flex', margin: '0 -20px', padding: '0 20px', overflow: 'hidden'}}>
      {items.map((it, i) => (
        <div
          key={it}
          style={{
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: size,
            fontWeight: weight.medium,
            whiteSpace: 'nowrap',
            background: i === idx ? color.ink : 'transparent',
            color: i === idx ? color.surfaceLow : color.ink,
          }}
        >
          {it}
        </div>
      ))}
    </div>
  );
};

/** Сегментированный переключатель (AppSegmentedControl compact): серая дорожка, белый «стеклянный» бегунок. */
export const AppSegments: React.FC<{items: string[]; active?: number}> = ({items, active = 0}) => (
  <div style={{display: 'flex', background: color.surfaceDim, borderRadius: 20, padding: 2, height: 40, boxSizing: 'border-box'}}>
    {items.map((it, i) => (
      <div
        key={it}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 18,
          fontSize: 14,
          fontWeight: i === active ? weight.semibold : weight.medium,
          background: i === active ? color.card : 'transparent',
          boxShadow: i === active ? '0 2px 6px rgba(26,27,31,0.08)' : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {it}
      </div>
    ))}
  </div>
);

/** График цены как в приложении: ломаная 2.2 px, зелёная при росте, заливка 22% → 0. */
export const AppChart: React.FC<{data: number[]; height?: number; at?: number; duration?: number}> = ({data, height = 160, at = 0, duration = 1.6}) => {
  const {t} = useClock();
  const p = easeAt(t, at, duration);
  const up = data[data.length - 1] >= data[0];
  const fg = up ? color.positive : color.negative;
  const w = SCREEN.width - 40;
  const x = scaleLinear().domain([0, data.length - 1]).range([2, w - 8]);
  const y = scaleLinear().domain([Math.min(...data), Math.max(...data)]).range([height - 24, 24]);
  const d = line<number>().x((_, i) => x(i)).y((v) => y(v))(data)!;
  const a = area<number>().x((_, i) => x(i)).y0(height).y1((v) => y(v))(data)!;
  const tip = getPointAtLength(d, getLength(d) * p);
  const id = `app-chart-${up ? 'up' : 'down'}`;
  return (
    <svg width={w} height={height} style={{overflow: 'visible', display: 'block'}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={fg} stopOpacity={0.22} />
          <stop offset="1" stopColor={fg} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={0} y={0} width={tip ? tip.x : 0} height={height} />
        </clipPath>
      </defs>
      <path d={a} fill={`url(#${id})`} clipPath={`url(#${id}-clip)`} />
      <path d={d} fill="none" stroke={fg} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" {...evolvePath(p, d)} />
      {tip && p > 0 && p < 1 ? (
        <>
          <circle cx={tip.x} cy={tip.y} r={5} fill={fg} />
          <circle cx={tip.x} cy={tip.y} r={3} fill={color.card} />
        </>
      ) : null}
    </svg>
  );
};

/** Шапка страницы компании: логотип 44, название 28/700, подпись тикера. */
export const AppStockHeader: React.FC<{avatar: AvatarName; name: string; ticker: string}> = ({avatar, name, ticker}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 12, minHeight: 72}}>
    <Avatar name={avatar} size={44} />
    <div>
      <div style={{fontSize: 28, fontWeight: weight.bold, lineHeight: '36px'}}>{name}</div>
      <div style={{fontSize: 16, color: color.inkMuted, lineHeight: '24px', marginTop: 4}}>{ticker}</div>
    </div>
  </div>
);

/** Цена и изменение за день над графиком + переключатель «линия / свечи». */
export const AppPrice: React.FC<{price: string; change: string}> = ({price, change}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <div>
      <div style={{fontSize: 24, fontWeight: weight.bold, lineHeight: '32px', fontVariantNumeric: 'tabular-nums'}}>{price}</div>
      <div style={{fontSize: 14, fontWeight: weight.medium, marginTop: 4}}>
        <span style={{color: color.positive}}>▲ {change}</span>
        <span style={{color: color.inkSoft}}> · За день</span>
      </div>
    </div>
    <div style={{width: 110, display: 'flex', background: color.surfaceDim, borderRadius: 20, padding: 2, height: 40, boxSizing: 'border-box'}}>
      <div style={{flex: 1, borderRadius: 18, background: color.card, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={20} height={20} viewBox="0 0 20 20">
          <path d="M3 14 L8 8 L11 11 L17 5" fill="none" stroke={color.ink} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width={20} height={20} viewBox="0 0 20 20">
          <path d="M6 3 V17 M14 3 V17" stroke={color.ink} strokeWidth={1.4} strokeLinecap="round" />
          <rect x={4} y={6} width={4} height={7} rx={1} fill={color.ink} />
          <rect x={12} y={8} width={4} height={6} rx={1} fill={color.ink} />
        </svg>
      </div>
    </div>
  </div>
);

/** «Строчки текста» — серые полоски вместо абзаца. */
export const AppLines: React.FC<{widths?: number[]}> = ({widths = [100, 92, 70]}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
    {widths.map((w, i) => (
      <div key={i} style={{height: 10, width: `${w}%`, borderRadius: 5, background: color.outline}} />
    ))}
  </div>
);

/** Строка «подпись — значение» (сектор, страна, комиссия…). */
export const AppFact: React.FC<{label: string; value: string}> = ({label, value}) => (
  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: weight.medium}}>
    <span style={{color: color.inkSoft}}>{label}</span>
    <span>{value}</span>
  </div>
);

/** Шкала аналитики (страница компании): градиент розовый → жёлтый → зелёный и тёмный маркер. */
export const AppScale: React.FC<{label: string; level: string; value: number; ends: [string, string]; at?: number}> = ({label, level, value, ends, at = 0}) => {
  const {frame, fps} = useClock();
  const p = springAt(frame, fps, at, 'medium');
  const v = 0.5 + (value - 0.5) * p;
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 14}}>
        <span style={{fontWeight: weight.medium, color: color.inkMuted}}>{label}</span>
        <span style={{fontWeight: weight.semibold, opacity: Math.min(1, Math.max(0, p) * 2)}}>{level}</span>
      </div>
      <div style={{position: 'relative', height: 20, borderRadius: 10, marginTop: 12, background: `linear-gradient(90deg, ${color.negative}, ${color.ratingNeutral}, ${color.positive})`}}>
        <div style={{position: 'absolute', top: -2, left: `calc(12px + (100% - 30px) * ${v})`, width: 6, height: 20, borderRadius: 3, background: color.ink, border: `2px solid ${color.surfaceLow}`}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: color.inkSoft, marginTop: 8}}>
        <span>{ends[0]}</span>
        <span>{ends[1]}</span>
      </div>
    </div>
  );
};

/** Новость (страница компании): цветная черта слева, заголовок, строчки, метка тикера и дата. */
export const AppNews: React.FC<{title: string; ticker: string; date: string; mood?: 'up' | 'down' | 'flat'}> = ({title, ticker, date, mood = 'flat'}) => (
  <div style={{borderLeft: `2px solid ${mood === 'up' ? color.positive : mood === 'down' ? color.negative : color.outline}`, paddingLeft: 12}}>
    <div style={{fontSize: 16, fontWeight: weight.semibold, lineHeight: '22px'}}>{title}</div>
    <div style={{marginTop: 8}}>
      <AppLines widths={[100, 62]} />
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 12}}>
      <span style={{background: color.primarySoft, borderRadius: 24, padding: '2px 4px', fontSize: 10, fontWeight: weight.medium}}>{ticker}</span>
      <span style={{fontSize: 12, fontWeight: weight.medium, color: color.inkSoft}}>{date}</span>
    </div>
  </div>
);

/** Кнопка приложения (AppButton): h64 r20; primary — фиолетовая, secondary — серая. `pressAt` — момент нажатия. */
export const AppButton: React.FC<{label: string; kind?: 'primary' | 'secondary'; pressAt?: number; height?: number}> = ({label, kind = 'primary', pressAt, height = 64}) => {
  const {t} = useClock();
  const k = pressAt === undefined ? -1 : (t - pressAt) / 0.5;
  const press = k >= 0 && k <= 1 ? Math.sin(k * Math.PI) : 0;
  const ring = pressAt === undefined ? -1 : (t - pressAt) / 0.8;
  const bg = kind === 'primary' ? color.primary : color.outline;
  return (
    <div style={{position: 'relative', flex: 1}}>
      {ring >= 0 && ring <= 1 ? (
        <div style={{position: 'absolute', inset: 0, borderRadius: 20, border: `3px solid ${color.primary}`, opacity: 1 - ring, transform: `scale(${1 + ring * 0.12}, ${1 + ring * 0.6})`}} />
      ) : null}
      <div
        style={{
          height,
          borderRadius: 20,
          background: bg,
          color: kind === 'primary' ? color.white : color.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: weight.medium,
          transform: `scale(${1 - press * 0.07})`,
          filter: press > 0 ? `brightness(${1 - press * 0.12})` : undefined,
        }}
      >
        {label}
      </div>
    </div>
  );
};

type CellProps = {
  /** Значок приложения слева */
  icon?: string;
  avatar?: AvatarName;
  /** Круглая картинка слева (типы ордеров) */
  image?: string;
  /** Кружок MBANK — «Денежные средства» */
  cash?: boolean;
  overline?: string;
  headline: string;
  supporting?: string;
  /** Справа: стрелка вниз, переключатель или две строки текста */
  trailing?: 'chevron' | 'switch' | 'info';
  right?: [string, string];
  radius?: number;
  selectAt?: number;
  selectUntil?: number;
  switchAt?: number;
};

/** Ячейка списка (AppListCell): белая, слева значок, мелкая надпись сверху и основное значение. */
export const AppCell: React.FC<CellProps> = ({icon, avatar, image, cash, overline, headline, supporting, trailing, right, radius = 20, selectAt, selectUntil, switchAt}) => {
  const {frame, fps, t} = useClock();
  const sel = selectAt === undefined ? 0 : windowAt(t, selectAt, selectUntil ?? 1e6, 0.2);
  const sw = switchAt === undefined ? 0 : springAt(frame, fps, switchAt, 'soft');
  return (
    <div
      style={{
        background: color.card,
        borderRadius: radius,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: `inset 0 0 0 ${2 * sel}px ${color.primary}`,
        transform: `scale(${1 + 0.02 * sel})`,
      }}
    >
      {icon ? <AppIcon name={icon} /> : null}
      {avatar ? <Avatar name={avatar} size={40} /> : null}
      {image ? <Img src={staticFile(`app/${image}.png`)} style={{width: 40, height: 40, borderRadius: 20, display: 'block'}} /> : null}
      {cash ? (
        <div style={{width: 40, height: 40, borderRadius: 20, background: color.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
          <Img src={staticFile('brand/mbank-logo.svg')} style={{width: 24, height: 24}} />
        </div>
      ) : null}
      <div style={{flex: 1, minWidth: 0}}>
        {overline ? <div style={{fontSize: 12, color: color.inkSoft, lineHeight: '16px', marginBottom: 4}}>{overline}</div> : null}
        <div style={{fontSize: 16, fontWeight: weight.medium, lineHeight: '20px'}}>{headline}</div>
        {supporting ? <div style={{fontSize: 14, color: color.inkSoft, lineHeight: '18px', marginTop: 4}}>{supporting}</div> : null}
      </div>
      {right ? (
        <div style={{textAlign: 'right'}}>
          <div style={{fontSize: 12, color: color.inkSoft, lineHeight: '16px', marginBottom: 4}}>{right[0]}</div>
          <div style={{fontSize: 16, fontWeight: weight.medium, lineHeight: '20px'}}>{right[1]}</div>
        </div>
      ) : null}
      {trailing === 'chevron' ? <AppIcon name="filter_chevron_down" /> : null}
      {trailing === 'info' ? (
        <div style={{width: 20, height: 20, borderRadius: 10, border: `1.6px solid ${color.info}`, color: color.info, fontSize: 12, fontWeight: weight.bold, display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'}}>i</div>
      ) : null}
      {trailing === 'switch' ? (
        <div style={{width: 44, height: 24, borderRadius: 12, padding: 2, boxSizing: 'border-box', background: sw > 0.5 ? color.primary : color.disabled, flexShrink: 0}}>
          <div style={{width: 20, height: 20, borderRadius: 10, background: color.white, transform: `translateX(${20 * Math.min(1, Math.max(0, sw))}px)`}} />
        </div>
      ) : null}
    </div>
  );
};

/** Поле ввода (AppInputField): белое, r20, мелкая подпись и значение. */
export const AppInput: React.FC<{label: string; value: string; suffix?: string; selector?: boolean; focusAt?: number; focusUntil?: number}> = ({label, value, suffix, selector, focusAt, focusUntil}) => {
  const {t} = useClock();
  const f = focusAt === undefined ? 0 : windowAt(t, focusAt, focusUntil ?? focusAt + 1.4, 0.2);
  return (
    <div style={{background: color.card, borderRadius: 20, padding: '10px 16px', display: 'flex', alignItems: 'center', boxShadow: `inset 0 0 0 ${2 * f}px ${color.primary}`}}>
      <div style={{flex: 1}}>
        <div style={{fontSize: 12, color: color.inkSoft, lineHeight: '16px'}}>{label}</div>
        <div style={{fontSize: 16, lineHeight: '24px'}}>{value}</div>
      </div>
      {suffix ? <div style={{fontSize: 16, color: color.inkSoft}}>{suffix}</div> : null}
      {selector ? <AppIcon name="filter_chevron_down" opacity={0.6} /> : null}
    </div>
  );
};

/** Крупная сумма по центру («На сумму» в конструкторе, «Стоимость портфеля»): число набегает с `at`. */
export const AppAmount: React.FC<{label: string; value: number; at?: number; align?: 'center' | 'left'; chips?: string[]; chipAt?: number}> = ({label, value, at = 0, align = 'center', chips, chipAt}) => {
  const {frame, fps, t} = useClock();
  const n = new Intl.NumberFormat('ru-RU').format(Math.round(value * easeAt(t, at, 0.9)));
  const cp = chipAt === undefined ? 0 : springAt(frame, fps, chipAt, 'strong');
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', gap: 8, padding: '4px 0'}}>
      <div style={{fontSize: 16, fontWeight: align === 'center' ? weight.semibold : weight.medium, color: color.inkSoft}}>{label}</div>
      <div style={{fontSize: align === 'center' ? 32 : 36, fontWeight: weight.bold, lineHeight: '40px', fontVariantNumeric: 'tabular-nums'}}>
        {n} <span style={{color: color.inkSoft}}>$</span>
      </div>
      {chips ? (
        <div style={{display: 'flex'}}>
          {chips.map((c, i) => (
            <div key={c} style={{padding: '8px 14px', borderRadius: 20, fontSize: 14, fontWeight: weight.medium, whiteSpace: 'nowrap', background: i === 0 && cp > 0.5 ? color.ink : 'transparent', color: i === 0 && cp > 0.5 ? color.card : color.ink, transform: i === 0 ? `scale(${kick(cp, 0.14)})` : undefined}}>
              {c}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/** Диапазон с двумя бегунками (AppRangeSlider): активная часть — окно в градиент розовый → жёлтый → зелёный. */
export const AppRange: React.FC<{lo: number; hi: number; at?: number; labels?: [string, string]}> = ({lo, hi, at = 0, labels}) => {
  const {frame, fps} = useClock();
  const p = springAt(frame, fps, at, 'medium');
  const a = lo * p;
  const b = 1 - (1 - hi) * p;
  const w = 310;
  const thumb: React.CSSProperties = {position: 'absolute', top: 0, width: 24, height: 24, borderRadius: 12, background: color.card, border: `1.5px solid ${color.primary}`, boxSizing: 'border-box', boxShadow: '0 2px 10px rgba(0,0,0,0.12)'};
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {labels ? (
        <div style={{display: 'flex', gap: 8}}>
          {labels.map((l) => (
            <div key={l} style={{flex: 1, minHeight: 44, background: color.surface, border: `1px solid ${color.card}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: weight.medium}}>
              {l}
            </div>
          ))}
        </div>
      ) : null}
      <div style={{position: 'relative', width: w, height: 24, alignSelf: 'center'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 8, height: 8, borderRadius: 4, background: color.outline}} />
        <div style={{position: 'absolute', left: a * w, width: (b - a) * w, top: 8, height: 8, borderRadius: 4, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: -a * w, width: w, top: 0, height: 8, background: `linear-gradient(90deg, ${color.negative} 8%, ${color.gold} 50%, ${color.positive} 92%)`}} />
        </div>
        <div style={{...thumb, left: a * (w - 24)}} />
        <div style={{...thumb, left: b * (w - 24)}} />
      </div>
    </div>
  );
};

/** Ряд галочек («Малые / Средние / Крупные»). */
export const AppChecks: React.FC<{items: {label: string; checkAt?: number}[]}> = ({items}) => {
  const {frame, fps} = useClock();
  return (
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      {items.map((it) => {
        const p = it.checkAt === undefined ? 0 : springAt(frame, fps, it.checkAt, 'strong');
        return (
          <div key={it.label} style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: weight.medium}}>
            <div style={{width: 20, height: 20, borderRadius: 6, boxSizing: 'border-box', border: p > 0.5 ? undefined : `1px solid ${color.outline}`, background: p > 0.5 ? color.primary : color.card, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${kick(p, 0.25)})`}}>
              {p > 0.5 ? (
                <svg width={12} height={12} viewBox="0 0 12 12">
                  <path d="M2.5 6.2 L5 8.6 L9.5 3.6" fill="none" stroke={color.white} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : null}
            </div>
            {it.label}
          </div>
        );
      })}
    </div>
  );
};

/** Мелкий поясняющий текст экрана. */
export const AppNote: React.FC<{children: string}> = ({children}) => (
  <div style={{fontSize: 16, lineHeight: '24px', color: color.inkMuted, textAlign: 'center', padding: '0 4px'}}>{children}</div>
);
