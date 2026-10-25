import { StyleSheet } from 'react-native';

const NotificationsStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 18,
    paddingBottom: 10,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FILTERS
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },

  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 13,
    alignItems: 'center',
  },

  filterButtonActive: {
    backgroundColor: '#3c8c84',
    borderColor: '#3c8c84',
  },

  filterText: {
    color: '#3c8c84',
    fontWeight: '700',
    fontSize: 15,
  },

  filterTextActive: {
    color: '#FFFFFF',
  },

  // MARK ALL AS READ
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 14,
  },

  markAllButton: {
    backgroundColor: '#4f759d',
    borderRadius: 18,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },

  markAllButtonDisabled: {
    opacity: 0.45,
  },

  markAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // DATE
  dateSection: {
    marginBottom: 5,
  },

  dateHeading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#1E1E1E',
    marginBottom: 12,
  },

  // NOTIFICATION CARD
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 0,
    shadowOpacity: 0,
  },

  unreadCard: {
    borderColor: '#4f899d',
  },

  cardContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },

  // TITLE + TIME
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },

  time: {
    fontSize: 14,
    color: '#777777',
    paddingTop: 3,
  },

  // MESSAGE
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 2,
  },

  // MARK AS READ BADGE
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },

  markReadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4f899d',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  markReadBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // EMPTY STATE
  emptyContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1E1E',
  },

  emptyText: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
    marginTop: 6,
  },
});

export default NotificationsStyles;