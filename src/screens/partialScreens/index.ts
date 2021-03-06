import AboutMindMirror from './AboutMindMirror';
import HowToUse from './HowToUse';
import AvatarExplanation from './AvatarExplanation';
import ColorExplanation from './ColorExplanation';
import SpotifyIntegration from './SpotifyIntegration';
import Eula from './Eula';
import Personalisation from './Personalisation';
import FitbitIntegration from './FitbitIntegration';
import WearableIntegration from './WearableIntegration';
import ScienceAndTechnology from './ScienceAndTechnology';
import SpotifyPlaylists from './SpotifyPlaylists';

export interface OnboardingScreensProps {
  component: () => JSX.Element;
  onboardingIndex: number;
}

export interface PartialScreensProps {
  title: string;
  component: () => JSX.Element;
}

export const OnboardingScreens = {
  0: Eula,
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
  ScienceAndTechnology: {
    title: 'Science and Technology',
    component: ScienceAndTechnology,
  },
  SpotifyPlaylists: {
    title: 'Spotify Playlists',
    component: SpotifyPlaylists,
  },
};
