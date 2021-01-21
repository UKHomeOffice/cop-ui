import React from 'react';
import { render } from '@testing-library/react';
import Logout from './Logout';
import SecureLocalStorageManager from '../../utils/SecureLocalStorageManager';

describe('Logout', () => {
  it('should render without crashing', () => {
    render(<Logout />);
  });

  it('should clear secure local storage on logout', () => {
    SecureLocalStorageManager.set('test-key-remove', 'test-value-remove');
    localStorage.setItem('test-key-keep', 'test-value-keep');

    render(<Logout />);

    expect(localStorage.getItem('test-key-remove')).toBeFalsy();
    expect(localStorage.getItem('test-key-keep')).toBeTruthy();
  });
});
