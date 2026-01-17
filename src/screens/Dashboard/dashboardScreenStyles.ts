import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    margin: 0,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  cardSubtitle: {
    color: '#666666',
  },
});
