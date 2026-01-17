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
  listContainer: {
    padding: 16,
    paddingTop: 20,
  },
  clientCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  clientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientIcon: {
    margin: 0,
    marginRight: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  clientEmail: {
    color: '#666666',
  },
});
