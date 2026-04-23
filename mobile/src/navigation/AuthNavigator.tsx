import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RangerSignupScreen from '../screens/auth/RangerSignupScreen';

export type AuthStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Login: undefined;
    RangerSignup: undefined;
    ForgotPassword: undefined;
    JoinWithInvite: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            {/* <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Login' }}
            /> */}

            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="RangerSignup"
                component={RangerSignupScreen}
                options={{ title: 'Sign Up' }}
            />

            {/* <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ title: 'Forgot Password' }}
            />

            <Stack.Screen
                name="JoinWithInvite"
                component={JoinWithInviteScreen}
                options={{ title: 'Join With Invite Code' }}
            /> */}
        </Stack.Navigator>
    );
}