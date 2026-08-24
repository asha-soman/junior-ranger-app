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
import CreateCohortScreen from "../screens/cohorts/CreateCohortScreen";
import EditCohortScreen from "../screens/cohorts/EditCohortScreen";
import AssignRangerScreen from "../screens/cohorts/AssignRangerScreen";
import GenerateInviteCodeScreen from "../screens/cohorts/GenerateInviteCodeScreen";
import RangerMenuScreen from "../screens/ranger/RangerMenuScreen";
import JuniorMenuScreen from "../screens/junior-ranger/JuniorMenuScreen";
import JoinCohortScreen from "../screens/junior-ranger/JoinCohortScreen";
import SocialFeedScreen from "../screens/junior-ranger/SocialFeedScreen";
import ActivityPostFormScreen from "../screens/junior-ranger/ActivityPostFormScreen";
import AdventureListScreen from '../screens/adventures/AdventureListScreen';
import CreateAdventureScreen from '../screens/adventures/CreateAdventureScreen';
import AdventureDetailsScreen from '../screens/adventures/AdventureDetailsScreen';
import EditAdventureScreen from '../screens/adventures/EditAdventureScreen';
import SubmitAdventureScreen from '../screens/submissions/SubmitAdventureScreen';
import AdventureSubmissionsScreen from '../screens/submissions/AdventureSubmissionsScreen';
import ReviewSubmissionScreen from '../screens/submissions/ReviewSubmissionScreen';
import EventsHubScreen from '../screens/events/EventsHubScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import EditEventScreen from '../screens/events/EditEventScreen';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  RangerSignup: {
    role?: "ranger" | "junior_ranger";
  };
  ForgotPassword: undefined;
  Verification: {
    email: string;
    mode?: "email" | "2fa";
  };
  JoinCohort: undefined;
  JoinWithInvite: undefined;
  Home: undefined;
  AdminMenu: undefined;
  PendingRangerRequests: { refresh?: boolean } | undefined;
  RangerRequestDetails: { rangerId: string };
  ManageUsers: { initialUsers?: AdminUser[] } | undefined;
  AdminCohorts:
    | {
        userRole?: "admin" | "ranger" | "junior_ranger";
      }
    | undefined;
    AdminCohortDetails: {
        cohortId: string;
        userRole?: "admin" | "ranger" | "junior_ranger";
    };
    CreateCohort: {
        userRole?: "admin" | "ranger";
    };
    EditCohort: {
        cohortId: string;
        userRole?: "admin" | "ranger";
    };
    AssignRanger: {
        cohortId: string;
        assignedRangerId?: string | null;
    };
    GenerateInviteCode: {
        cohortId: string;
    };
    RangerMenu: undefined;
    JuniorMenu: undefined;
    AdventureList:
    | {
        cohortId?: string;
        userRole?: "ranger" | "admin" | "junior_ranger";
      }
    | undefined;
  AdventureDetails: { adventureId: string };
  CreateAdventure: { cohortId?: string } | undefined;
  EditAdventure: { adventureId: string };
  SubmitAdventure: { adventureId: string };
  AdventureSubmissions: { adventureId: string };
  ReviewSubmission: { submissionId: string };
    EventsHub:
    | {
        userRole: 'admin' | 'ranger' | 'junior_ranger';
    }
    | undefined;
    CreateEvent:
    | {
        cohortId?: string;
        userRole?: 'admin' | 'ranger';
    }
    | undefined;

    EditEvent:
    | {
        eventId: string;
        userRole: 'admin' | 'ranger';
    };
    SocialFeed: undefined;

    ActivityPostForm:
    | {
        postId?: string;
    }
    | undefined;
  Settings: undefined;
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

      <Stack.Screen
        name="JoinCohort"
        component={JoinCohortScreen}
        options={{
          ...authHeaderOptions,
          title: "Join Cohort",
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

      <Stack.Screen
        name="CreateCohort"
        component={CreateCohortScreen}
        options={{
          ...authHeaderOptions,
          title: "Create Cohort",
        }}
      />

      <Stack.Screen
        name="EditCohort"
        component={EditCohortScreen}
        options={{
          ...authHeaderOptions,
          title: "Edit Cohort",
        }}
      />

      <Stack.Screen
        name="AdventureList"
        component={AdventureListScreen}
        options={{ title: "Adventures" }}
      />

      <Stack.Screen
        name="CreateAdventure"
        component={CreateAdventureScreen}
        options={{ title: "Create Adventure" }}
      />

      <Stack.Screen
        name="AdventureDetails"
        component={AdventureDetailsScreen}
        options={{ title: "Adventure Details" }}
      />

      <Stack.Screen
        name="EditAdventure"
        component={EditAdventureScreen}
        options={{ title: "Edit Adventure" }}
      />

      <Stack.Screen
        name="SubmitAdventure"
        component={SubmitAdventureScreen}
        options={{ title: "Submit Adventure" }}
      />

      <Stack.Screen
        name="AdventureSubmissions"
        component={AdventureSubmissionsScreen}
        options={{ title: "Adventure Submissions" }}
      />

      <Stack.Screen
        name="ReviewSubmission"
        component={ReviewSubmissionScreen}
        options={{ title: "Review Submission" }}
      />

      <Stack.Screen
        name="AssignRanger"
        component={AssignRangerScreen}
        options={{
          ...authHeaderOptions,
          title: "Assign Ranger",
        }}
      />

            <Stack.Screen
                name="GenerateInviteCode"
                component={GenerateInviteCodeScreen}
                options={{
                    ...authHeaderOptions,
                    title: "Generate Invite Code",
                }}
            />

            <Stack.Screen
                name="EventsHub"
                component={EventsHubScreen}
                options={{
                    ...authHeaderOptions,
                    title: 'Events',
                }}
            />

            <Stack.Screen
                name="CreateEvent"
                component={CreateEventScreen}
                options={{
                    ...authHeaderOptions,
                    title: 'Create Event',
                }}
            />

            <Stack.Screen
                name="EditEvent"
                component={EditEventScreen}
                options={{
                    ...authHeaderOptions,
                    title: 'Edit Event',
                }}
            />

      <Stack.Screen
        name="RangerMenu"
        component={RangerMenuScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="JuniorMenu"
        component={JuniorMenuScreen}
        options={{ headerShown: false }}
      />

            <Stack.Screen
                name="SocialFeed"
                component={SocialFeedScreen}
                options={{
                    ...authHeaderOptions,
                    title: "Feed",
                }}
            />

            <Stack.Screen
                name="ActivityPostForm"
                component={ActivityPostFormScreen}
                options={{
                    ...authHeaderOptions,
                    title: "Share an Activity",
                }}
            />

      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
