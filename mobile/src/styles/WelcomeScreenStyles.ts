import { StyleSheet } from 'react-native';

export const WelcomeScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        marginBottom: 8,
        color: '#1E1E1E',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        color: '#555',
    },
    primaryButton: {
        width: '80%',
        backgroundColor: '#2D2D2D',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        width: '80%',
        backgroundColor: '#6E837D',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});