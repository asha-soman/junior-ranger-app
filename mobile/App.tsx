import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';

import { en, registerTranslation } from 'react-native-paper-dates';

registerTranslation('en', en);

export default function App() {
  return <RootNavigator />;
}