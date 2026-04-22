import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { signupRanger } from '../../services/auth/authService';

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
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
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

        if (password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters.');
            return false;
        }

        if (!agreedToTerms) {
            Alert.alert(
                'Validation Error',
                'Please agree to the Terms and Conditions and Privacy Policy.'
            );
            return false;
        }

        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                firstName: firstName.trim(),
                surname: surname.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber.trim(),
                password: password.trim(),
            };

            const response = await signupRanger(payload);

            Alert.alert(
                'Success',
                response?.message || 'Account created successfully.'
            );

            setFirstName('');
            setSurname('');
            setEmail('');
            setPhoneNumber('');
            setPassword('');
            setAgreedToTerms(false);
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong during signup.';
            Alert.alert('Signup Failed', errorMessage);
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
                    I agree to the Terms and Conditions{'\n'}and the Privacy Policy
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RangerSignupScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#F4F4F4',
        paddingBottom: 30,
    },
    header: {
        backgroundColor: '#6E837D',
        paddingVertical: 22,
        paddingHorizontal: 24,
        marginTop: 20,
        marginHorizontal: 10,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: '700',
    },
    card: {
        marginTop: 26,
        marginHorizontal: 30,
        borderRadius: 28,
        padding: 18,
        backgroundColor: '#6F8F8B',
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 8,
        marginTop: 6,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 6,
        paddingHorizontal: 12,
        height: 46,
        marginBottom: 8,
        fontSize: 16,
        color: '#1E1E1E',
    },
    button: {
        marginTop: 18,
        alignSelf: 'center',
        backgroundColor: '#2D2D2D',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 22,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '500',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 18,
        marginHorizontal: 38,
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1.5,
        borderColor: '#333333',
        marginTop: 2,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#2D2D2D',
        borderColor: '#2D2D2D',
    },
    checkmark: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    termsText: {
        fontSize: 14,
        color: '#1E1E1E',
        lineHeight: 20,
    },
});