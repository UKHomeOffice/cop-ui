import SecureLS from 'secure-ls';

export default class SecureLocalStorageManager {
  static ls = new SecureLS({
    encodingType: 'aes',
    encryptionSecret: process.env.WWW_STORAGE_KEY,
    isCompression: true,
  });

  static set = (key, value) => {
    this.remove(key);
    this.ls.set(key, value);
  };

  static get = (key) => this.ls.get(key);

  static remove = (key) => this.ls.remove(key);

  static removeAll = () => this.ls.removeAll();
}
