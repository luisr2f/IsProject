import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
  headerWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
