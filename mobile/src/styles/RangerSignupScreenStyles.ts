import { StyleSheet } from 'react-native';

export const RangerSignupScreenStyles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#F4F4F4',
        paddingBottom: 80,
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

juniorCard: {
    backgroundColor: '#6F8F8B', // lighter orange
},

rangerCard: {
    backgroundColor: '#6F8F8B', // keep existing look
},

juniorButton: {
    backgroundColor: '#FB8C00',
},

rangerButton: {
    backgroundColor: '#2D2D2D',
},

juniorLabel: {
    color: '#E65100',
},

rangerLabel: {
    color: '#1E1E1E',
},

consentText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
},

});