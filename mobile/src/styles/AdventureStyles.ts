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

    submissionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginTop: 14,
    },

    helperText: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 14,
        lineHeight: 19,
    },
    submissionListCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
    },

    submissionUser: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E1E1E',
        marginBottom: 6,
    },

    submissionText: {
        fontSize: 14,
        color: '#333333',
        lineHeight: 20,
        marginBottom: 8,
    },

    imageUrlText: {
        fontSize: 13,
        color: '#3D786B',
        marginBottom: 8,
    },

    reviewButton: {
        marginTop: 10,
        borderRadius: 8,
    },

    reviewCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 18,
        marginTop: 14,
    },

    statusButtonRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },

    approveButton: {
        flex: 1,
        backgroundColor: '#3D786B',
        borderRadius: 8,
    },

    rejectButton: {
        flex: 1,
        backgroundColor: '#9A3D3D',
        borderRadius: 8,
    },

    selectedStatusText: {
        fontSize: 14,
        color: '#3D786B',
        fontWeight: '700',
        marginBottom: 12,
    },
    submissionStatusCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 16,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#DDEDEA',
    },

    feedbackBox: {
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
    },

    statusMessage: {
        fontSize: 14,
        color: '#555555',
        marginTop: 8,
        lineHeight: 20,
    },
});