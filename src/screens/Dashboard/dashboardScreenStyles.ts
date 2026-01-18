import { colors } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDashboard,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  pressableCard: {
    width: '90%',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    elevation: 2,
    backgroundColor: 'white',
    minHeight: 140,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  cardIcon: {
    margin: 0,
    marginRight: 16,
    width: 80,
    height: 80,
  },
  cardText: {
    flex: 1,
    flexShrink: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
    fontSize: 20,
  },
  cardSubtitle: {
    color: '#666666',
    fontSize: 14,
  },
});
