import { colors } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
  },
  newClientButton: {
    width: '100%',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchbar: {
    backgroundColor: '#F2F2F7',
    borderRadius: 4,
    elevation: 0,
    marginBottom: 12,
  },
  searchbarInput: {
    fontSize: 14,
  },
  searchTypeContainer: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  searchTypeChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTypeChipSelected: {
    backgroundColor: '#E7E8EB',
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
    backgroundColor: '#FAFAFB',
    elevation: 1,
    borderWidth: 0,
    paddingVertical: 10,
  },
  clientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,

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
    marginRight: -8,
  },
  loading: {
    marginTop: 120
  }
});
