import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { WelcomeScreenStyles as styles } from '@/src/styles/WelcomeScreenStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {

  const handleRoleSelect = (role: 'ranger' | 'junior_ranger') => {
    navigation.navigate('RangerSignup', { role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Junior Ranger App</Text>
      <Text style={styles.subtitle}>Welcome</Text>

      {/* Sign In */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Sign up as Ranger */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => handleRoleSelect('ranger')}
      >
        <Text style={styles.secondaryButtonText}>
          Sign up as Ranger
        </Text>
      </TouchableOpacity>

      {/* Sign up as Junior Ranger */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 10 }]}
        onPress={() => handleRoleSelect('junior_ranger')}
      >
        <Text style={styles.secondaryButtonText}>
           Sign up as Junior Ranger
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default WelcomeScreen;
