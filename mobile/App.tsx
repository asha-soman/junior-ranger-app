import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import ValidateInviteCodeScreen from './src/screens/junior/ValidateInviteCodeScreen';
import CohortListScreen from './src/screens/ranger/CohortListScreen';
import CohortDetailsScreen from './src/screens/ranger/CohortDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Junior Stack
function JuniorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JoinCohort" 
        component={ValidateInviteCodeScreen} 
        options={{ title: 'Junior Ranger' }}
      />
    </Stack.Navigator>
  );
}

// Ranger Stack
function RangerStack() {
  return (
    <Stack.Navigator initialRouteName="CohortList">
      <Stack.Screen 
        name="CohortList" 
        component={CohortListScreen} 
        options={{ title: 'Ranger Panel' }}
      />
      <Stack.Screen 
        name="CohortDetails" 
        component={CohortDetailsScreen} 
        options={{ title: 'Cohort Details' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Junior') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Ranger') {
              iconName = focused ? 'shield' : 'shield-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2e7d32',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Junior" component={JuniorStack} />
        <Tab.Screen name="Ranger" component={RangerStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
