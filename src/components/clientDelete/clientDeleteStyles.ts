import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignSelf: 'stretch',
  },
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    padding: 0,
  },
  modalContent: {
    padding: 24,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  modalMessage: {
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
