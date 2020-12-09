import SecureLS from 'secure-ls';

const secureLocalStorage = new SecureLS({
  encodingType: 'aes',
  encryptionSecret: process.env.WWW_STORAGE_KEY,
  isCompression: true,
});

secureLocalStorage.setInitialValue = (key, defaultValue) => {
  return secureLocalStorage.get(key) ? secureLocalStorage.get(key) : defaultValue;
};

secureLocalStorage.updateStoredValue = (key, updatedValue) => {
  secureLocalStorage.remove(key);
  secureLocalStorage.set(key, updatedValue);
};

export default secureLocalStorage;
