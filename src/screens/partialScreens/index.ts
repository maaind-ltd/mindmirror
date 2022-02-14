import AboutMindMirror from './AboutMindMirror';
import HowToUse from './HowToUse';
import AvatarExplanation from './AvatarExplanation';
import ColorExplanation from './ColorExplanation';
import SpotifyIntegration from './SpotifyIntegration';
import InternalTesterWarning from './InternalTesterWarning';

export interface OnboardingScreensProps {
  component: () => JSX.Element;
  onboardingIndex: number;
}

export interface PartialScreensProps {
  title: string;
  component: () => JSX.Element;
}

export const OnboardingScreens = {
  0: InternalTesterWarning,
  1: ColorExplanation,
  2: AvatarExplanation,
  3: SpotifyIntegration,
};

export const PartialScreens: {[name: string]: PartialScreensProps} = {
  AboutMindMirror: {
    title: 'About MindMirror',
    component: AboutMindMirror,
  },
  HowToUse: {
    title: 'How to use MindMirror',
    component: HowToUse,
  },
};
