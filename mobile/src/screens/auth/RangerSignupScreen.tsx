import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { signupRanger } from '../../services/auth/authService';
import { RangerSignupScreenStyles as styles } from '@/src/styles/RangerSignupScreenStyles';

const RangerSignupScreen = () => {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!firstName.trim()) {
            Alert.alert('Validation Error', 'Please enter your first name.');
            return false;
        }

        if (!surname.trim()) {
            Alert.alert('Validation Error', 'Please enter your surname.');
            return false;
        }

        if (!email.trim()) {
            Alert.alert('Validation Error', 'Please enter your email.');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            Alert.alert('Validation Error', 'Please enter a valid email.');
            return false;
        }

        if (!phoneNumber.trim()) {
            Alert.alert('Validation Error', 'Please enter your phone number.');
            return false;
        }

        if (!password.trim()) {
            Alert.alert('Validation Error', 'Please enter your password.');
            return false;
        }

        if (password.trim().length < 6) {
            Alert.alert(
                'Validation Error',
                'Password must be at least 6 characters.'
            );
            return false;
        }

        if (!agreedToTerms) {
            Alert.alert(
                'Validation Error',
                'Please agree to the Terms and Conditions.'
            );
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        const payload = {
            name: `${firstName.trim()} ${surname.trim()}`.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: 'ranger' as const,
        };

        // console.log('Signup button clicked');
        // console.log('Signup payload:', payload);

        try {
            setLoading(true);

            const result = await signupRanger(payload);

            //console.log('Signup response:', result);

            Alert.alert(
                'Success',
                result?.message || 'Account created successfully.'
            );

            setFirstName('');
            setSurname('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setAgreedToTerms(false);
        } catch (error: any) {
            //console.error('Signup error:', error);

            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong during signup.';

            Alert.alert('Signup Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Sign Up</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#B0B0B0"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <Text style={styles.label}>Surname</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#B0B0B0"
                    value={surname}
                    onChangeText={setSurname}
                />

                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#B0B0B0"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#B0B0B0"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Create Account</Text>
                    )}
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
                activeOpacity={0.8}
            >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                    {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>

                <Text style={styles.termsText}>
                    I agree to the Terms and Conditions{'\n'}
                    and the Privacy Policy
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RangerSignupScreen;