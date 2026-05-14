import { StyleSheet } from 'react-native';

export const adventureStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },

    header: {
        backgroundColor: '#3D786B',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },

    headerTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
    },

    content: {
        padding: 14,
        paddingBottom: 90,
    },

    createButton: {
        backgroundColor: '#3D786B',
        borderRadius: 8,
        marginBottom: 14,
    },

    createButtonLabel: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    card: {
        marginBottom: 14,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E1E1E',
    },

    cardDescription: {
        fontSize: 14,
        color: '#333333',
        marginTop: 6,
        lineHeight: 20,
    },

    metaRow: {
        marginTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    dueDate: {
        fontSize: 13,
        color: '#555555',
    },

    statusChip: {
        backgroundColor: '#DDEDEA',
    },

    statusText: {
        color: '#3D786B',
        fontSize: 12,
        fontWeight: '700',
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#555555',
        fontSize: 16,
    },

    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },

    loader: {
        marginTop: 30,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginTop: 14,
    },

    input: {
        marginBottom: 14,
        backgroundColor: '#FFFFFF',
    },

    textArea: {
        minHeight: 100,
    },

    submitButton: {
        backgroundColor: '#3D786B',
        borderRadius: 8,
        marginTop: 10,
        paddingVertical: 4,
    },

    cancelButton: {
        marginTop: 10,
    },
});