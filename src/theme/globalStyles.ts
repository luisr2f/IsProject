import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  inputContent: {
    fontSize: 16,
  },
  tallInput: {
    minHeight: 100,
  },
  errorText: {
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyErrorText: {
    color: colors.error,
    marginTop: 16,
  },
});
