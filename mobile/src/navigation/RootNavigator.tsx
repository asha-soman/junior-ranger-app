import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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

export default function RootNavigator() {
    return (
        <NavigationContainer linking={linking}>
            <AuthNavigator />
        </NavigationContainer>
    );
}