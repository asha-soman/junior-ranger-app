import { StyleSheet } from 'react-native';

export const attendanceManagementStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 30,
      paddingBottom: 20,
    },

    summaryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      padding: 16,
      marginBottom: 16,
    },

    summaryTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#376E62',
    },

    summaryText: {
      fontSize: 14,
      color: '#667085',
      marginTop: 4,
    },

    participantCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      padding: 16,
      marginBottom: 14,
    },

    participantName: {
      fontSize: 18,
      fontWeight: '700',
      color: '#111111',
    },

    participantEmail: {
      fontSize: 14,
      color: '#667085',
      marginTop: 3,
      marginBottom: 14,
    },

    statusLabel: {
      fontSize: 13,
      color: '#667085',
      marginBottom: 8,
    },

    statusRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },

    statusButton: {
      flexGrow: 1,
      borderRadius: 8,
    },

    selectedPresent: {
      backgroundColor: '#DCEFE7',
    },

    selectedAbsent: {
      backgroundColor: '#F8E3E3',
    },

    selectedNotMarked: {
      backgroundColor: '#E9ECEF',
    },

    statusText: {
      fontSize: 14,
      fontWeight: '600',
    },

    markedText: {
      marginTop: 10,
      fontSize: 12,
      color: '#7A7A7A',
    },

    loader: {
      marginTop: 40,
    },

    emptyText: {
      textAlign: 'center',
      color: '#667085',
      fontSize: 15,
      marginTop: 40,
    },

    errorContainer: {
      alignItems: 'center',
      marginTop: 40,
      paddingHorizontal: 20,
    },

    errorText: {
      color: '#A33A3A',
      textAlign: 'center',
      marginBottom: 12,
    },

    summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    },

    summaryLabel: {
    fontSize: 14,
    color: '#555555',
    },

    summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111111',
    },

    searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#D9DEDC',
    },

    searchIcon: {
    marginRight: 8,
    },

    searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
    paddingVertical: 13,
    },    
  });