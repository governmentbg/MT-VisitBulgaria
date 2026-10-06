import * as Keychain from 'react-native-keychain';
import {createMMKV} from 'react-native-mmkv';
import {generateSecureKey} from './secureRandom';

const KEYCHAIN_SERVICE = 'com.visitbulgaria.mmkv-auth';
const KEYCHAIN_USERNAME = 'encryption-key';

type MMKVStorage = ReturnType<typeof createMMKV>;

async function getOrCreateEncryptionKey(): Promise<string> {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });
    if (credentials) {
      return credentials.password;
    }
  } catch (error) {
    console.warn(
      '[SecureStorage] Failed to read keychain, generating new key:',
      error,
    );
  }

  const key = generateSecureKey();
  await Keychain.setGenericPassword(KEYCHAIN_USERNAME, key, {
    service: KEYCHAIN_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
  });
  return key;
}

let cachedStorage: MMKVStorage | null = null;

export async function getEncryptedAuthStorage(): Promise<MMKVStorage> {
  if (cachedStorage) {
    return cachedStorage;
  }

  const encryptionKey = await getOrCreateEncryptionKey();
  cachedStorage = createMMKV({
    id: 'auth-storage',
    mode: 'multi-process',
    encryptionKey,
  });
  return cachedStorage;
}
