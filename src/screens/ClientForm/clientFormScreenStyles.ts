import { colors } from '@/theme';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  buttonFullWidth: {
    width: '100%',
  },
  scrollView: {
    backgroundColor: colors.background,
  },
});
