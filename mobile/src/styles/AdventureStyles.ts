import {
  StyleSheet,
} from 'react-native';

export const adventureStyles =
  StyleSheet.create({
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
      justifyContent:
        'space-between',
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

    adventureProgressSection: {
      marginTop: 24,
    },

    sectionHeading: {
      fontSize: 18,
      fontWeight: '700',
      color: '#3D786B',
      marginTop: 12,
      marginBottom: 12,
    },

    progressLoader: {
      marginVertical: 16,
    },

    progressSummaryRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    progressSummary: {
      fontSize: 14,
      color: '#444444',
      flex: 1,
    },

    progressPercentage: {
      fontSize: 16,
      fontWeight: '700',
      color: '#3D786B',
      marginLeft: 10,
    },

    adventureProgressBarBackground: {
      height: 12,
      backgroundColor: '#DCE7E4',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 18,
    },

    adventureProgressBarFill: {
      height: '100%',
      backgroundColor: '#4A9493',
      borderRadius: 8,
    },

    taskCard: {
      backgroundColor: '#F7F9F8',
      borderWidth: 1,
      borderColor: '#DDE7E4',
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
    },

    taskTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    taskIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#E5F0E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    taskInfo: {
      flex: 1,
    },

    taskTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1E1E1E',
    },

    taskXp: {
      fontSize: 13,
      fontWeight: '600',
      color: '#3D786B',
      marginTop: 3,
    },

    taskStatus: {
      fontSize: 13,
      color: '#666666',
      marginTop: 3,
    },

    taskSubmitButton: {
      backgroundColor: '#3D786B',
      borderRadius: 8,
      marginTop: 12,
    },

    taskWaitingBox: {
      backgroundColor: '#FFF7E6',
      borderRadius: 8,
      padding: 10,
      marginTop: 12,
    },

    taskWaitingText: {
      color: '#7A5A16',
      fontSize: 13,
    },

    taskApprovedBox: {
      backgroundColor: '#E7F4EC',
      borderRadius: 8,
      padding: 10,
      marginTop: 12,
    },

    taskApprovedText: {
      color: '#2F6B49',
      fontSize: 13,
      fontWeight: '600',
    },

    taskRejectedBox: {
      backgroundColor: '#FBEAEA',
      borderRadius: 8,
      padding: 10,
      marginTop: 12,
    },

    taskRejectedText: {
      color: '#963F3F',
      fontSize: 13,
      fontWeight: '600',
    },

    emptyTaskText: {
      fontSize: 14,
      color: '#666666',
      marginBottom: 12,
      lineHeight: 20,
    },

    taskSubmitTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1E1E1E',
      marginBottom: 8,
    },

    taskFormSection: {
      marginTop: 26,
      marginBottom: 18,
    },

    taskSectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: '#3D786B',
      marginBottom: 6,
    },

    taskSectionHelper: {
      fontSize: 13,
      color: '#666666',
      lineHeight: 19,
      marginBottom: 16,
    },

    taskFormCard: {
      backgroundColor: '#F7F9F8',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#DDE7E4',
      padding: 14,
      marginBottom: 14,
    },

    taskFormHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    taskFormTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: '#1E1E1E',
    },

    taskDescriptionInput: {
      minHeight: 80,
    },

    addTaskButton: {
      borderColor: '#3D786B',
      borderRadius: 8,
      marginTop: 2,
    },

    taskManagementHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
    },

    taskCountText: {
      fontSize: 13,
      color: '#666666',
    },

    rangerTaskCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#F7F9F8',
      borderWidth: 1,
      borderColor: '#DDE7E4',
      borderRadius: 12,
      padding: 14,
      marginBottom: 12,
    },

    rangerTaskNumber: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#E5F0E8',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    rangerTaskNumberText: {
      color: '#3D786B',
      fontSize: 15,
      fontWeight: '700',
    },

    rangerTaskDescription: {
      fontSize: 13,
      color: '#555555',
      lineHeight: 18,
      marginTop: 4,
    },
  });