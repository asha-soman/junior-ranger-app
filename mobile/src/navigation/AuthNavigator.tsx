import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import SplashScreen from '../screens/auth/SplashScreen';
// import LoginScreen from '../screens/auth/LoginScreen';
import RangerSignupScreen from '../screens/auth/RangerSignupScreen';
// import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
// import JoinWithInviteScreen from '../screens/auth/JoinWithInviteScreen';

export type AuthStackParamList = {
    Splash: undefined;
    Login: undefined;
    RangerSignup: undefined;
    ForgotPassword: undefined;
    JoinWithInvite: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="RangerSignup">
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