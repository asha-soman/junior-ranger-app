import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import AuthNavigator from './AuthNavigator';

const linking = {
    prefixes: ['http://localhost:8081'],
    config: {
        screens: {
            Splash: '',
            Welcome: 'welcome',
            Login: 'login',
            RangerSignup: 'signup',
            ForgotPassword: 'forgot-password',
            Verification: 'verify-code/:email',
            JoinWithInvite: 'join-with-invite',
            Home: "home",
        },
    },
};

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#376E62',
    onSurface: '#111111',
    onSurfaceVariant: '#333333',
  },
};

export default function RootNavigator() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}