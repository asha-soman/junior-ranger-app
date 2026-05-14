import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CreateAdventureScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Adventure Screen</Text>
            <Text style={styles.subtitle}>This is where Rangers/Admins will create adventures.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F4F4F4',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});