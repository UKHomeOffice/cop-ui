import SecureLocalStorageManager from './SecureLocalStorageManager';

describe('SecureLocalStorageManager', () => {
  const testKey = 'test-key';
  beforeEach(() => {
    localStorage.clear();
  });

  it('should successfully return item from local storage on get', () => {
    const expectedResult = 'hello';

    SecureLocalStorageManager.set(testKey, expectedResult);

    expect(localStorage.setItem).toHaveBeenCalled();

    const result = SecureLocalStorageManager.get(testKey);

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(result).toBe(expectedResult);
  });

  it('should update item value in local storage', async () => {
    const initialValue = 'foo';
    const expectedResult = 'bar';

    SecureLocalStorageManager.set(testKey, initialValue);

    expect(SecureLocalStorageManager.get(testKey)).toBe(initialValue);

    SecureLocalStorageManager.set(testKey, expectedResult);
    const result = SecureLocalStorageManager.get(testKey);

    expect(result).toBe(expectedResult);
  });

  it('should remove an item with a specific key from local storage', () => {
    const value = 'cheese';

    SecureLocalStorageManager.set(testKey, value);

    expect(SecureLocalStorageManager.get(testKey)).toBe(value);

    SecureLocalStorageManager.remove(testKey);

    expect(SecureLocalStorageManager.get(testKey)).toBeFalsy();
  });

  it('only clears secure local storage set keys', () => {
    const localStorageValues = [];
    const secureLocalStorageValues = [];

    for (let i = 1; i < 4; i += 1) {
      localStorageValues.push({
        keyName: `ls-key-${i}`,
        keyValue: `value-${i}`,
      });
      secureLocalStorageValues.push({
        keyName: `secure-ls-key-${i}`,
        keyValue: `value-${i}`,
      });
    }

    for (let i = 0; i < 3; i += 1) {
      localStorage.setItem(localStorageValues[i].keyName, localStorageValues[i].keyValue);
      SecureLocalStorageManager.set(
        secureLocalStorageValues[i].keyName,
        secureLocalStorageValues[i].keyValue
      );
    }

    for (let i = 0; i < 3; i += 1) {
      expect(localStorage.getItem(localStorageValues[i].keyName)).toBeTruthy();
      expect(localStorage.getItem(secureLocalStorageValues[i].keyName)).toBeTruthy();
      // Ensure that values are accessible by SecureLocalStorageManager
      expect(SecureLocalStorageManager.get(secureLocalStorageValues[i].keyName)).toBeTruthy();
    }

    SecureLocalStorageManager.removeAll();

    for (let i = 0; i < 3; i += 1) {
      expect(localStorage.getItem(localStorageValues[i].keyName)).toBeTruthy();
      expect(localStorage.getItem(secureLocalStorageValues[i].keyName)).toBeFalsy();
      // Ensure that values have not been stowed away elsewhere
      expect(SecureLocalStorageManager.get(secureLocalStorageValues[i].keyName)).toBeFalsy();
    }
  });
});
