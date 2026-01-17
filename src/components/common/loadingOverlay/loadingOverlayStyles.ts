import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
  },
});
