import React from 'react';
import {Composition} from 'remotion';
import {buildLesson, LessonVideo, video} from './kit';
import {demoLesson} from './lessons/demo/lesson';
import {introLesson} from './lessons/intro/lesson';
import {CardStyles} from './showcase/CardStyles';

const IntroLesson: React.FC = () => <LessonVideo lesson={introLesson} fps={video.fps} />;
const DemoLesson: React.FC = () => <LessonVideo lesson={demoLesson} fps={video.fps} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DemoLesson"
      component={DemoLesson}
      durationInFrames={buildLesson(demoLesson, video.fps).durationInFrames}
      fps={video.fps}
      width={video.width}
      height={video.height}
    />
    <Composition
      id="IntroLesson"
      component={IntroLesson}
      durationInFrames={buildLesson(introLesson, video.fps).durationInFrames}
      fps={video.fps}
      width={video.width}
      height={video.height}
    />
    <Composition id="CardStyles" component={CardStyles} durationInFrames={120} fps={video.fps} width={video.width} height={video.height} />
  </>
);
