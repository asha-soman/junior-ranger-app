import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';

const linking = {
    prefixes: ['http://localhost:8081'],
    config: {
        screens: {
            Splash: '',
            Welcome: 'welcome',
            Login: 'signin',
            RangerSignup: 'signup',
            ForgotPassword: 'forgot-password',
            JoinWithInvite: 'join-with-invite',
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