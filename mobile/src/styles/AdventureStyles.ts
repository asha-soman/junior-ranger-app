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

    /*
     * =====================================
     * GENERAL ADVENTURE PROGRESS
     * =====================================
     */

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

    /*
     * =====================================
     * JUNIOR RANGER PROGRESS CARD
     * =====================================
     */

    juniorProgressCard: {
      backgroundColor: '#EAF8F5',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#C5E7DF',
      padding: 18,
      marginBottom: 22,

      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 2,
    },

    juniorProgressTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },

    juniorProgressIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#D7F0EA',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    juniorProgressEyebrow: {
      color: '#579287',
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
      marginBottom: 2,
    },

    juniorProgressTitle: {
      color: '#225C55',
      fontSize: 20,
      fontWeight: '800',
    },

    progressPercentBadge: {
      minWidth: 58,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#C5E7DF',
    },

    progressPercentBadgeText: {
      color: '#267C78',
      fontSize: 17,
      fontWeight: '800',
    },

    juniorProgressBarBackground: {
      height: 16,
      backgroundColor: '#D1E5E0',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 18,
    },

    juniorProgressBarFill: {
      height: '100%',
      backgroundColor: '#52A99D',
      borderRadius: 10,
    },

    progressStatsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 14,
    },

    progressStatItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    progressStatDivider: {
      width: 1,
      height: 34,
      backgroundColor: '#D9E9E5',
      marginHorizontal: 10,
    },

    progressStatValue: {
      fontSize: 15,
      fontWeight: '800',
      color: '#2D554F',
    },

    progressStatLabel: {
      fontSize: 11,
      color: '#6E817D',
      marginTop: 1,
    },

    encouragementBox: {
      backgroundColor: '#FFF6D8',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#F4E1A6',
    },

    encouragementText: {
      textAlign: 'center',
      color: '#775A15',
      fontSize: 13,
      fontWeight: '700',
      lineHeight: 19,
    },

    /*
     * =====================================
     * ADVENTURE COMPLETE
     * =====================================
     */

    adventureCompleteBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#FFF8DC',
      borderWidth: 1,
      borderColor: '#F0D783',
      borderRadius: 16,
      padding: 15,
      marginBottom: 20,
    },

    adventureCompleteTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: '#725617',
    },

    adventureCompleteText: {
      fontSize: 13,
      color: '#826A31',
      marginTop: 2,
    },

    adventureCompleteEmoji: {
      fontSize: 25,
    },


    completionOverlay: {
      flex: 1,
      backgroundColor: 'rgba(19, 55, 49, 0.76)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 22,
      overflow: 'hidden',
    },

    completionCelebrationCard: {
      width: '100%',
      maxWidth: 430,
      backgroundColor: '#FFFDF6',
      borderRadius: 26,
      borderWidth: 2,
      borderColor: '#F0D98C',
      paddingHorizontal: 22,
      paddingTop: 26,
      paddingBottom: 22,
      alignItems: 'center',

      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 10,
    },

    completionTrophyCircle: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: '#FFF1BC',
      borderWidth: 6,
      borderColor: '#FFF8DE',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    completionEyebrow: {
      color: '#69958B',
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1.4,
      marginBottom: 7,
    },

    completionCelebrationTitle: {
      color: '#255F55',
      fontSize: 25,
      lineHeight: 31,
      fontWeight: '900',
      textAlign: 'center',
    },

    completionAdventureName: {
      color: '#3D786B',
      fontSize: 17,
      lineHeight: 23,
      fontWeight: '800',
      textAlign: 'center',
      marginTop: 6,
    },

    completionCelebrationText: {
      color: '#66736F',
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 18,
    },

    completionStatsRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F1F9F6',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#D7EAE4',
      paddingVertical: 14,
      paddingHorizontal: 12,
      marginBottom: 14,
    },

    completionStat: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    completionStatDivider: {
      width: 1,
      height: 58,
      backgroundColor: '#D7E5E1',
    },

    completionStatValue: {
      color: '#2D5E55',
      fontSize: 19,
      fontWeight: '900',
      marginTop: 3,
    },

    completionStatLabel: {
      color: '#71827D',
      fontSize: 11,
      fontWeight: '600',
      marginTop: 1,
    },

    completionMessageBox: {
      width: '100%',
      backgroundColor: '#FFF5D0',
      borderRadius: 13,
      borderWidth: 1,
      borderColor: '#F1DFA1',
      paddingVertical: 11,
      paddingHorizontal: 12,
      marginBottom: 16,
    },

    completionMessageText: {
      color: '#775B17',
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '800',
      textAlign: 'center',
    },

    completionContinueButton: {
      width: '100%',
      backgroundColor: '#3D786B',
      borderRadius: 14,
    },

    /*
     * =====================================
     * JUNIOR RANGER MISSIONS
     * =====================================
     */

    missionSectionHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },

    missionHeadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    missionHeadingIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      backgroundColor: '#3D786B',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 11,
    },

    missionSectionEyebrow: {
      color: '#7A9992',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1,
    },

    missionSectionTitle: {
      color: '#245F57',
      fontSize: 21,
      fontWeight: '800',
      marginTop: 1,
    },

    missionCountBadge: {
      minWidth: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#FFF1BE',
      borderWidth: 1,
      borderColor: '#EBD58A',
      alignItems: 'center',
      justifyContent: 'center',
    },

    missionCountText: {
      color: '#9C7013',
      fontSize: 15,
      fontWeight: '800',
    },

    juniorMissionCard: {
      borderWidth: 1.5,
      borderRadius: 18,
      padding: 15,
      marginBottom: 15,

      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 5,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 1,
    },

    missionNumberBadge: {
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      paddingHorizontal: 9,
      paddingVertical: 4,
      marginBottom: 10,
    },

    missionNumberText: {
      color: '#66807A',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    missionTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    missionIconContainer: {
      width: 54,
      height: 54,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 13,
    },

    missionInfo: {
      flex: 1,
    },

    missionTitle: {
      color: '#1F3935',
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 21,
    },

    missionMetaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 7,
      marginTop: 9,
    },

    xpRewardPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FFF3C8',
      borderRadius: 12,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    xpRewardText: {
      color: '#9C7013',
      fontSize: 11,
      fontWeight: '800',
    },

    missionStatusPill: {
      borderRadius: 12,
      paddingHorizontal: 9,
      paddingVertical: 5,
    },

    missionStatusText: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.2,
    },

    missionStartButton: {
      backgroundColor: '#3D8677',
      borderRadius: 12,
      marginTop: 14,
    },

    missionStartButtonContent: {
      minHeight: 44,
    },

    missionStartButtonLabel: {
      fontSize: 14,
      fontWeight: '800',
    },

    missionWaitingBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#FFF0C7',
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 14,
    },

    missionWaitingText: {
      flex: 1,
      color: '#855E17',
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 18,
    },

    missionApprovedBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#DFF3E7',
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 14,
    },

    missionApprovedText: {
      flex: 1,
      color: '#2E704E',
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18,
    },

    missionRejectedBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#FBE6DD',
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginTop: 14,
    },

    missionRejectedText: {
      flex: 1,
      color: '#984C30',
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 18,
    },

    /*
     * =====================================
     * OLD TASK STYLES
     * Kept for other existing screens
     * =====================================
     */

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

    /*
     * =====================================
     * TASK CREATE / EDIT
     * =====================================
     */

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

    /*
     * =====================================
     * RANGER / ADMIN TASK VIEW
     * =====================================
     */

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

    /*
     * =====================================
     * JUNIOR RANGER ADVENTURE HERO
     * =====================================
     */

    juniorDetailsShell: {
      marginTop: 14,
    },

    juniorAdventureHero: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#D9F2EE',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#B9E0D8',
      padding: 20,
      marginBottom: 12,

      shadowColor: '#000000',
      shadowOpacity: 0.05,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 2,
    },

    juniorAdventureDecorOne: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#BEE8E0',
      top: -50,
      right: -30,
      opacity: 0.65,
    },

    juniorAdventureDecorTwo: {
      position: 'absolute',
      width: 75,
      height: 75,
      borderRadius: 38,
      backgroundColor: '#CDEEDC',
      bottom: -28,
      left: -18,
      opacity: 0.65,
    },

    juniorHeroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 15,
    },

    juniorPublishedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255,255,255,0.82)',
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#B9DDD6',
    },

    juniorPublishedText: {
      color: '#2F7468',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },

    juniorHeroIcon: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: '#3D8677',
      alignItems: 'center',
      justifyContent: 'center',
    },

    juniorHeroEyebrow: {
      color: '#4F8C82',
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1.2,
      marginBottom: 6,
    },

    juniorHeroTitle: {
      color: '#173F3A',
      fontSize: 27,
      lineHeight: 33,
      fontWeight: '800',
      marginBottom: 10,
    },

    juniorHeroDescription: {
      color: '#315B55',
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '500',
    },

    juniorInstructionBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 9,
      backgroundColor: 'rgba(255,255,255,0.72)',
      borderRadius: 14,
      padding: 12,
      marginTop: 16,
      borderWidth: 1,
      borderColor: '#C2E1DA',
    },

    juniorInstructionText: {
      flex: 1,
      color: '#315B55',
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
    },

    juniorAdventureStats: {
      flexDirection: 'row',
      alignItems: 'stretch',
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#D8EAE6',
      paddingVertical: 13,
      paddingHorizontal: 8,
      marginBottom: 2,

      shadowColor: '#000000',
      shadowOpacity: 0.04,
      shadowRadius: 5,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 1,
    },

    juniorAdventureStat: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },

    juniorStatIcon: {
      width: 38,
      height: 38,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },

    juniorStatIconBlue: {
      backgroundColor: '#E2F3F6',
    },

    juniorStatIconGold: {
      backgroundColor: '#FFF2CF',
    },

    juniorStatIconGreen: {
      backgroundColor: '#E1F2EA',
    },

    juniorStatLabel: {
      color: '#71847F',
      fontSize: 10,
      fontWeight: '700',
      marginBottom: 2,
      textAlign: 'center',
    },

    juniorStatValue: {
      color: '#244E48',
      fontSize: 13,
      fontWeight: '800',
      textAlign: 'center',
    },

    juniorStatDivider: {
      width: 1,
      backgroundColor: '#E1ECE9',
      marginVertical: 7,
    },

    juniorExploreFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#E7F5EF',
      borderRadius: 17,
      borderWidth: 1,
      borderColor: '#CBE6DC',
      padding: 14,
      marginTop: 5,
      marginBottom: 6,
    },

    juniorExploreFooterIcon: {
      width: 45,
      height: 45,
      borderRadius: 16,
      backgroundColor: '#D3ECE2',
      alignItems: 'center',
      justifyContent: 'center',
    },

    juniorExploreFooterTitle: {
      color: '#245E55',
      fontSize: 14,
      fontWeight: '800',
      marginBottom: 3,
    },

    juniorExploreFooterText: {
      color: '#5B7771',
      fontSize: 11,
      lineHeight: 16,
    },
  
    /*
     * =====================================
     * ADVENTURE LIST THEME
     * =====================================
     */

    adventureListContent: {
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: 90,
    },

    adventureListJuniorHero: {
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#DFF3EE',
      borderRadius: 22,
      borderWidth: 1,
      borderColor: '#C6E5DD',
      padding: 20,
      marginBottom: 20,
    },

    adventureListHeroDecorOne: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#C9E9E1',
      right: -42,
      top: -48,
    },

    adventureListHeroDecorTwo: {
      position: 'absolute',
      width: 74,
      height: 74,
      borderRadius: 37,
      backgroundColor: '#EAF8F4',
      left: -20,
      bottom: -26,
    },

    adventureListHeroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },

    adventureListHeroIcon: {
      width: 54,
      height: 54,
      borderRadius: 18,
      backgroundColor: '#3D786B',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 13,
    },

    adventureListHeroEyebrow: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1.1,
      color: '#6A998F',
      marginBottom: 3,
    },

    adventureListHeroTitle: {
      fontSize: 26,
      lineHeight: 31,
      fontWeight: '900',
      color: '#285F56',
    },

    adventureListHeroText: {
      fontSize: 14,
      lineHeight: 21,
      color: '#456B63',
      fontWeight: '600',
      marginBottom: 14,
      maxWidth: 320,
    },

    adventureListHeroTip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      backgroundColor: '#FFF5D4',
      borderRadius: 12,
      paddingVertical: 9,
      paddingHorizontal: 11,
      borderWidth: 1,
      borderColor: '#EEDFA7',
      alignSelf: 'flex-start',
    },

    adventureListHeroTipText: {
      flexShrink: 1,
      color: '#775D20',
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '700',
    },

    adventureListAdminHeader: {
      backgroundColor: '#E9F5F2',
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#D1E8E2',
    },

    adventureListAdminHeaderTop: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },

    adventureListHeaderIcon: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: '#3D786B',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    adventureListAdminEyebrow: {
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 1,
      color: '#759A92',
      marginBottom: 2,
    },

    adventureListAdminTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: '#2A6258',
      marginBottom: 3,
    },

    adventureListAdminSubtitle: {
      color: '#62736F',
      fontSize: 12,
      lineHeight: 17,
    },

    adventureListCreateButton: {
      backgroundColor: '#3D786B',
      borderRadius: 13,
    },

    adventureListSectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 2,
    },

    adventureListSectionEyebrow: {
      fontSize: 10,
      fontWeight: '900',
      letterSpacing: 1,
      color: '#7C9E96',
      marginBottom: 2,
    },

    adventureListSectionTitle: {
      color: '#2A6258',
      fontSize: 20,
      fontWeight: '900',
    },

    adventureListCountBadge: {
      minWidth: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: '#FFF1BE',
      borderWidth: 1,
      borderColor: '#EAD58E',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },

    adventureListCountText: {
      color: '#916A18',
      fontWeight: '900',
      fontSize: 14,
    },

    adventureListCard: {
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      marginBottom: 14,
      borderWidth: 1,
      borderColor: '#E1E8E5',
      overflow: 'hidden',

      shadowColor: '#000000',
      shadowOpacity: 0.07,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      elevation: 3,
    },

    juniorAdventureListCard: {
      backgroundColor: '#F8FCFA',
      borderColor: '#D3E8E2',
    },

    adventureListCardTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    adventureListIcon: {
      width: 46,
      height: 46,
      borderRadius: 15,
      backgroundColor: '#4A9487',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },

    adventureListCardTitleWrap: {
      flex: 1,
      paddingRight: 8,
    },

    adventureListCardTitle: {
      color: '#1F3F39',
      fontSize: 17,
      lineHeight: 22,
      fontWeight: '900',
    },

    adventureListEyebrow: {
      color: '#65A195',
      fontSize: 9,
      fontWeight: '900',
      letterSpacing: 0.8,
      marginTop: 3,
    },

    adventureListArrow: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: '#E5F2EE',
      alignItems: 'center',
      justifyContent: 'center',
    },

    adventureListDescription: {
      color: '#5C6865',
      fontSize: 13,
      lineHeight: 19,
      marginTop: 12,
    },

    adventureListDivider: {
      height: 1,
      backgroundColor: '#E5ECE9',
      marginVertical: 13,
    },

    adventureListMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    adventureListDateWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingRight: 10,
    },

    adventureListMetaIcon: {
      width: 31,
      height: 31,
      borderRadius: 10,
      backgroundColor: '#E6F1EE',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },

    adventureListMetaLabel: {
      color: '#82918D',
      fontSize: 9,
      fontWeight: '700',
      marginBottom: 1,
      textTransform: 'uppercase',
    },

    adventureListDate: {
      color: '#455652',
      fontSize: 12,
      fontWeight: '700',
    },

    adventureListStatusChip: {
      backgroundColor: '#DDF0EA',
      borderRadius: 12,
    },

    adventureListStatusText: {
      color: '#337466',
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
    },

    adventureListEmptyCard: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8FBFA',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#DDE8E5',
      paddingVertical: 34,
      paddingHorizontal: 20,
      marginTop: 8,
    },

    adventureListEmptyTitle: {
      marginTop: 10,
      color: '#3B675F',
      fontSize: 17,
      fontWeight: '800',
    },

    adventureListEmptyText: {
      marginTop: 5,
      color: '#6D7875',
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },

});