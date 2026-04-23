import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { WelcomeScreenStyles as styles } from '@/src/styles/WelcomeScreenStyles';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Junior Ranger App</Text>
            <Text style={styles.subtitle}>Welcome</Text>

            <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('RangerSignup')}
            >
                <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;