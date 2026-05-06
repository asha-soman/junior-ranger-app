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

});