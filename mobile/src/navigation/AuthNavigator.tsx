import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authHeaderOptions } from "./navigationStyles";

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RangerSignupScreen from '../screens/auth/RangerSignupScreen';
import LoginScreen from "../screens/auth/loginScreen";
import ForgotPasswordScreen from "../screens/auth/forgotPasswordScreen";
import VerificationScreen from "../screens/auth/verificationScreen";
import SplashScreen from '../screens/auth/SplashScreen';

export type AuthStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Login: undefined;
    RangerSignup: undefined;
    ForgotPassword: undefined;
    Verification: { email: string };
    JoinWithInvite: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
                name="Splash"
                component={SplashScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ 
                ...authHeaderOptions,
                title: "Sign In",
                 }}
            /> 

            <Stack.Screen
                name="RangerSignup"
                component={RangerSignupScreen}
                options={{ 
                ...authHeaderOptions,    
                title: 'Sign Up' }}
            />

            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ 
                ...authHeaderOptions,
                title: 'Forgot Password' }}
            />

            <Stack.Screen
                name="Verification"
                component={VerificationScreen}
                options={{ 
                ...authHeaderOptions,    
                title: 'Verification' }}
            />

            {/*<Stack.Screen
                name="JoinWithInvite"
                component={JoinWithInviteScreen}
                options={{ title: 'Join With Invite Code' }}
            /> */}

        </Stack.Navigator>
    );
}