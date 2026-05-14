import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authHeaderOptions } from "./navigationStyles";
import { AdminUser } from "../services/admin/adminService";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import RangerSignupScreen from "../screens/auth/RangerSignupScreen";
import LoginScreen from "../screens/auth/loginScreen";
import ForgotPasswordScreen from "../screens/auth/forgotPasswordScreen";
import VerificationScreen from "../screens/auth/verificationScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import AdminMenuScreen from "../screens/admin/AdminMenuScreen";
import PendingRangerRequestsScreen from "../screens/admin/PendingRangerRequestsScreen";
import RangerRequestDetailsScreen from "../screens/admin/RangerRequestDetailsScreen";
import ManageUsersScreen from "../screens/admin/ManageUsersScreen";
import AdminCohortsScreen from "../screens/admin/AdminCohortsScreen";
import AdminCohortDetailsScreen from "../screens/admin/AdminCohortDetailsScreen";

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  RangerSignup: {
    role?: "ranger" | "junior_ranger";
  };
  ForgotPassword: undefined;
  Verification: { email: string };
  JoinWithInvite: undefined;
  Home: undefined;
  AdminMenu: undefined;
  PendingRangerRequests: { refresh?: boolean } | undefined;
  RangerRequestDetails: { rangerId: string };
  ManageUsers: { initialUsers?: AdminUser[] } | undefined;
  AdminCohorts: undefined;
  AdminCohortDetails: { cohortId: string };
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
          title: "Sign Up",
        }}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          ...authHeaderOptions,
          title: "Forgot Password",
        }}
      />

      <Stack.Screen
        name="Verification"
        component={VerificationScreen}
        options={{
          ...authHeaderOptions,
          title: "Verification",
        }}
      />

      {/*<Stack.Screen
                name="JoinWithInvite"
                component={JoinWithInviteScreen}
                options={{ title: 'Join With Invite Code' }}
            /> */}

      <Stack.Screen
        name="AdminMenu"
        component={AdminMenuScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PendingRangerRequests"
        component={PendingRangerRequestsScreen}
        options={{
          ...authHeaderOptions,
          title: "Signup Requests ",
        }}
      />

      <Stack.Screen
        name="RangerRequestDetails"
        component={RangerRequestDetailsScreen}
        options={{
          ...authHeaderOptions,
          title: "Request Details",
        }}
      />

      <Stack.Screen
        name="ManageUsers"
        component={ManageUsersScreen}
        options={{
          ...authHeaderOptions,
          title: "Manage Users",
        }}
      />

      <Stack.Screen
        name="AdminCohorts"
        component={AdminCohortsScreen}
        options={{
          ...authHeaderOptions,
          title: "Cohorts",
        }}
      />

      <Stack.Screen
        name="AdminCohortDetails"
        component={AdminCohortDetailsScreen}
        options={{
          ...authHeaderOptions,
          title: "Cohort Details",
        }}
      />
    </Stack.Navigator>
  );
}
