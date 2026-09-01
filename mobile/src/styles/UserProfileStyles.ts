import { StyleSheet } from 'react-native';

export const userProfileStyles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F4F4F4',
    },

    content: {
      paddingHorizontal: 18,
      paddingTop: 30,
      paddingBottom: 30,
    },

    profileCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 22,

      borderWidth: 1,
      borderColor: '#dcd3d3',
    },

    avatarContainer: {
      alignItems: 'center',
      marginBottom: 15,
    },

    avatar: {
      width: 130,
      height: 130,
      borderRadius: 65,
    },

    avatarPlaceholder: {
      width: 130,
      height: 130,
      borderRadius: 65,
      backgroundColor: '#E5F0E8',
      alignItems: 'center',
      justifyContent: 'center',
    },

    name: {
      fontSize: 27,
      fontWeight: '700',
      color: '#2f7494',
      marginTop: 12,
      textAlign: 'center',
    },

    role: {
      fontSize: 20,
      color: '#545a67',
      marginTop: 4,
      textAlign: 'center',
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#4a9493',
      marginBottom: 17,
      marginTop: 7,
    },

    infoRow: {
    backgroundColor: '#F7F7F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    },

    fieldGroup: {
    marginBottom: 16,
    },

    infoLabel: {
    fontSize: 15,
    color: '#434141',
    marginBottom: 7,
    },

    infoBox: {
    backgroundColor: 'hsla(168, 11%, 91%, 0.93)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    },

    infoValue: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '500',
    },

    loaderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    },

    errorText: {
      fontSize: 15,
      color: '#A33A3A',
      textAlign: 'center',
      marginBottom: 16,
    },

    retryButton: {
      marginTop: 8,
    },
  });