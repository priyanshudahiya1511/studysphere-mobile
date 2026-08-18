import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await Keychain.setGenericPassword(key, value, { service: key });
  },

  getItem: async (key: string): Promise<string | null> => {
    const result = await Keychain.getGenericPassword({ service: key });
    return result ? result.password : null;
  },

  deleteItem: async (key: string): Promise<void> => {
    await Keychain.resetGenericPassword({ service: key });
  },
};
