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
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchbar: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    elevation: 0,
    marginBottom: 12,
  },
  searchbarInput: {
    fontSize: 16,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  searchTypeChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTypeChipSelected: {
    backgroundColor: '#F2F2F7',
    borderColor: '#F2F2F7',
  },
  searchTypeChipText: {
    color: '#000000',
    fontSize: 14,
    textAlign: 'center',
  },
  searchTypeChipTextSelected: {
    color: '#000000',
    fontWeight: '500',
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
    marginLeft: 16,
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
