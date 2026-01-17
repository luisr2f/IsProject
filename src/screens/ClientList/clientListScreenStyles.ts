import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 20,
  },
  newClientButton: {
    width: '100%',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  clientCard: {
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 0,
    paddingVertical: 10,
  },
  clientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  avatar: {
    marginRight: 16,
    backgroundColor: '#FF0000',
  },
  clientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  clientName: {
    fontWeight: '500',
    marginBottom: 0,
    color: '#000000',
  },
  clientNumber: {
    color: '#8E8E93',
    fontSize: 14,
  },
  chevron: {
    margin: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#8E8E93',
    marginTop: 16,
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 16,
  },
});
