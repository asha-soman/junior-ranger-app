import { StyleSheet } from 'react-native';

export const eventStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  content: {
    padding: 14,
    paddingBottom: 90,
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

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: '#1E1E1E',
  },

  input: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },

  textArea: {
    minHeight: 100,
  },

  row: {
    flexDirection: 'row',
    gap: 10,
  },

  rowInput: {
    flex: 1,
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

  submitButton: {
    backgroundColor: '#3D786B',
    borderRadius: 8,
    marginTop: 10,
  },

  secondaryButton: {
    marginTop: 10,
  },

  publishButton: {
    marginTop: 18,
    borderRadius: 8,
  },

  cancelEventButton: {
    marginTop: 10,
    borderRadius: 8,
  },

  deleteButton: {
    marginTop: 10,
    borderRadius: 8,
  },

  statusText: {
    fontWeight: '700',
    color: '#3D786B',
    marginBottom: 14,
  },

  loader: {
    marginTop: 40,
  },
});