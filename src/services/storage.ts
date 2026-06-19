import { MMKV } from 'react-native-mmkv';

// Instância real do MMKV para storage de altíssima performance
export const mmkvInstance = new MMKV();

export const storage = {
  getString: (key: string) => mmkvInstance.getString(key) || null,
  set: (key: string, value: string) => mmkvInstance.set(key, value),
  remove: (key: string) => mmkvInstance.delete(key), // O MMKV usa .delete internamente, mapeamos para .remove para manter a interface atual
};
