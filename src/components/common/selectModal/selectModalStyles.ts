import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputContent: {
    paddingRight: 0,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
    minHeight: 200,
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionsList: {
    maxHeight: 400,
    minHeight: 120,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  optionText: {
    flex: 1,
  },
  optionSeparator: {
    marginLeft: 16,
  },
});
