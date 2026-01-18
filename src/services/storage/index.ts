/**
 * Servicios de almacenamiento local
 * AsyncStorage, SecureStore, etc.
 *
 * Para usar este archivo, instala: npm install @react-native-async-storage/async-storage
 */

// import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (_key: string) => {
    // TODO: Descomentar cuando AsyncStorage esté instalado
    // try {
    //   const value = await AsyncStorage.getItem(key);
    //   return value ? JSON.parse(value) : null;
    // } catch (error) {
    //   console.error('Error reading from storage:', error);
    //   return null;
    // }
    return null;
  },
  set: async (_key: string, _value: any) => {
    // TODO: Descomentar cuando AsyncStorage esté instalado
    // try {
    //   await AsyncStorage.setItem(key, JSON.stringify(value));
    // } catch (error) {
    //   console.error('Error writing to storage:', error);
    // }
  },
  remove: async (_key: string) => {
    // TODO: Descomentar cuando AsyncStorage esté instalado
    // try {
    //   await AsyncStorage.removeItem(key);
    // } catch (error) {
    //   console.error('Error removing from storage:', error);
    // }
  },
};
