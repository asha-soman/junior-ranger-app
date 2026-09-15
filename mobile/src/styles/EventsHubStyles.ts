import { StyleSheet } from 'react-native';

export const eventsHubStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },

    header: {
      backgroundColor: '#376E62',
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 18,
    },

    headerTitle: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '700',
    },

    headerSubtitle: {
      color: '#E8F1EE',
      fontSize: 14,
      marginTop: 4,
    },

    content: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: 14,
    },

    createButton: {
      borderRadius: 8,
      marginBottom: 16,
      backgroundColor: '#376E62',
    },

    createButtonContent: {
      minHeight: 48,
    },

    listContent: {
      paddingBottom: 30,
    },

    card: {
      backgroundColor: '#FFFFFF',
      marginBottom: 14,
      borderRadius: 14,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 8,
    },

    cardTitle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '700',
      color: '#202020',
    },

    description: {
      fontSize: 14,
      lineHeight: 20,
      color: '#555555',
      marginBottom: 14,
    },

    infoRow: {
      flexDirection: 'row',
      marginBottom: 6,
    },

    infoLabel: {
      width: 80,
      fontSize: 14,
      fontWeight: '600',
      color: '#555555',
    },

    infoText: {
      flex: 1,
      fontSize: 14,
      color: '#222222',
    },

    deadlineContainer: {
      backgroundColor: '#EEF5F2',
      borderRadius: 8,
      padding: 10,
      marginTop: 8,
    },

    deadlineText: {
      color: '#376E62',
      fontSize: 13,
      fontWeight: '600',
    },

    manageHint: {
      marginTop: 12,
      fontSize: 12,
      color: '#376E62',
      fontWeight: '600',
    },

    loader: {
      marginTop: 50,
    },

    errorContainer: {
      alignItems: 'center',
      marginTop: 40,
      gap: 14,
    },

    errorText: {
      color: '#A33A3A',
      textAlign: 'center',
      marginBottom: 10,
    },

    emptyText: {
      textAlign: 'center',
      color: '#777777',
      marginTop: 50,
      fontSize: 15,
    },
  });