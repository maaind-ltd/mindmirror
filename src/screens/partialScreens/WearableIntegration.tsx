import React from 'react';
import FitbitIntegration from './FitbitIntegration';
import AppleWatchIntegration from './AppleWatchIntegration';
import {isAndroid} from '../../helpers/accessoryFunctions';

const WearableIntegration: () => JSX.Element = () => {
  if (isAndroid) {
    return <FitbitIntegration />;
  } else {
    return <AppleWatchIntegration />;
  }
};

export default WearableIntegration;
