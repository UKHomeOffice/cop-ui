import SecureLS from 'secure-ls';

const secureLocalStorage = new SecureLS({
  encodingType: 'aes',
  encryptionSecret: process.env.WWW_STORAGE_KEY,
  isCompression: true,
});

export default secureLocalStorage;
