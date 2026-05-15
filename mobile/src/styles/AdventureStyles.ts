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
    dropdownBox: {
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 6,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 14,
        marginBottom: 14,
    },

    dropdownText: {
        fontSize: 16,
        color: '#1E1E1E',
    },

    dropdownPlaceholder: {
        fontSize: 16,
        color: '#777777',
    },

    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#CFCFCF',
        borderRadius: 6,
        marginTop: -8,
        marginBottom: 14,
        overflow: 'hidden',
    },

    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },

    dropdownItemText: {
        fontSize: 15,
        color: '#1E1E1E',
    },

    dropdownError: {
        color: '#B00020',
        marginBottom: 10,
        fontSize: 13,
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginTop: 14,
    },

    detailsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 10,
    },

    detailsLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3D786B',
        marginTop: 14,
        marginBottom: 4,
    },

    detailsText: {
        fontSize: 15,
        color: '#333333',
        lineHeight: 22,
    },

    editButton: {
        backgroundColor: '#3D786B',
        borderRadius: 8,
        marginTop: 22,
    },
});