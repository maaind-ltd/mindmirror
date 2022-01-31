import AboutMindMirror from './AboutMindMirror';
import HowToUse from './HowToUse';
import AvatarExplanation from './AvatarExplanation';
import ColorExplanation from './ColorExplanation';

export interface OnboardingScreensProps {
  component: () => JSX.Element;
  onboardingIndex: number;
}

export interface PartialScreensProps {
  title: string;
  component: () => JSX.Element;
}

export const OnboardingScreens = {
  0: ColorExplanation,
  1: AvatarExplanation,
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
