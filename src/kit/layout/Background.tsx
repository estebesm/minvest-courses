import React from 'react';
import {color} from '../tokens';

/** Фон кадра: статичный белый. Никакого движения — живость дают сами элементы сцены. */
export const Background: React.FC = () => <div style={{position: 'absolute', inset: 0, background: color.bg}} />;
