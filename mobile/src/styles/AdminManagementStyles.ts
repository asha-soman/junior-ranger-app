import { StyleSheet } from 'react-native';

export const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  content: {
    padding: 18,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#1b6687',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },

  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  email: {
    fontSize: 15,
    color: '#F4F4F4',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    color: '#EDEDED',
    fontWeight: '600',
  },

  value: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2D2D2D',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 2,
  },

  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  emptyCard: {
    backgroundColor: '#2c8385',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#fffcfc',
    textAlign: 'center',
  },

  errorText: {
    color: '#B00020',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E1E1E',
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    width: '97%',
    alignSelf: 'center',
  },

  detailTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 18,
  },

  detailRow: {
    marginBottom: 14,
  },

  detailLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#36889c',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 16,
    color: '#1E1E1E',
  },

  actionButton: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },

  approveButton: {
    backgroundColor: '#458f7f',
  },

  rejectButton: {
    backgroundColor: '#36889c',
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  detailTitleCentered: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 22,
    textAlign: 'center',
  },

  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  inlineButton: {
    width: '47%',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 8,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },

  filterChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  activeFilterChip: {
    backgroundColor: '#376e62',
    borderColor: '#376e62',
  },

  filterChipText: {
    color: '#376e62',
    fontWeight: '700',
  },

  activeFilterChipText: {
    color: '#FFFFFF',
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },

  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E1E1E',
    flex: 1,
    marginRight: 10,
  },

  userEmail: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 12,
  },

  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  userInfoLabel: {
    fontSize: 14,
    color: '#36889c',
    fontWeight: '700',
  },

  userInfoValue: {
    fontSize: 14,
    color: '#1E1E1E',
  },

  userStatusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  approvedBadge: {
    backgroundColor: '#458f7f',
  },

  pendingBadge: {
    backgroundColor: '#36889c',
  },

  rejectedBadge: {
    backgroundColor: '#B04A4A',
  },

  userStatusText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  dropdownButtonText: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '400',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 24,
  },

  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 8,
  },

  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },

  dropdownOptionText: {
    fontSize: 16,
    color: '#1E1E1E',
  },

  topFilterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },

  topFilterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 13,
    alignItems: 'center',
  },

  activeTopFilterButton: {
    backgroundColor: '#376e62',
    borderColor: '#376e62',
  },

  topFilterButtonText: {
    color: '#376e62',
    fontWeight: '700',
    fontSize: 15,
  },

  activeTopFilterButtonText: {
    color: '#FFFFFF',
  },

});