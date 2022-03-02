import AboutMindMirror from './AboutMindMirror';
import HowToUse from './HowToUse';
import AvatarExplanation from './AvatarExplanation';
import ColorExplanation from './ColorExplanation';
import SpotifyIntegration from './SpotifyIntegration';
import InternalTesterWarning from './InternalTesterWarning';
import Personalisation from './Personalisation';
import FitbitIntegration from './FitbitIntegration';
import WearableIntegration from './WearableIntegration';

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
  1: Personalisation,
  2: ColorExplanation,
  3: AvatarExplanation,
  4: SpotifyIntegration,
  5: WearableIntegration,
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
