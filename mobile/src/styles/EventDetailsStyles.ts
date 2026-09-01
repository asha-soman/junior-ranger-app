import { StyleSheet } from 'react-native';

export const eventDetailsStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 30,
    },

    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 20,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 10,
    },

    title: {
      flex: 1,
      fontSize: 25,
      fontWeight: '700',
      color: '#1B1B1B',
    },

    description: {
      fontSize: 15,
      color: '#555555',
      lineHeight: 22,
      marginTop: 10,
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#3F8E8E',
      marginTop: 12,
      marginBottom: 12,
    },

    fieldGroup: {
      marginBottom: 14,
    },

    label: {
      fontSize: 13,
      color: '#6B7280',
      marginBottom: 6,
    },

    infoBox: {
      backgroundColor: '#EAF3F0',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },

    value: {
      fontSize: 15,
      color: '#111111',
      fontWeight: '500',
    },

    registrationBox: {
      backgroundColor: '#EEF5F2',
      borderRadius: 12,
      padding: 16,
      marginTop: 4,
    },

    registrationTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#376E62',
      marginBottom: 10,
    },

    registrationLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: '#333333',
      marginBottom: 2,
    },

    registrationText: {
      fontSize: 15,
      color: '#333333',
      marginBottom: 6,
      fontWeight: '400',
    },

    registrationStatusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },

    registrationOpen: {
      color: '#1F6F5B',
      fontWeight: '700',
      marginLeft: 5,
    },

    registrationClosed: {
      color: '#A33A3A',
      fontWeight: '700',
      marginLeft: 5,
    },

    manageButton: {
      marginTop: 20,
      backgroundColor: '#376E62',
      borderRadius: 8,
    },

    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },

    errorText: {
      color: '#A33A3A',
      textAlign: 'center',
      marginTop: 12,
      marginBottom: 16,
      fontSize: 15,
    },

    retryButton: {
      marginTop: 6,
    },
  });