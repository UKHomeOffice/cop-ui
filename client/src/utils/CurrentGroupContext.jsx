import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SecureLocalStorageManager from './SecureLocalStorageManager';

export const CurrentGroupContext = createContext({
  currentGroup: undefined,
  setCurrentGroup: () => {},
  groupLoaded: false,
  setGroupLoaded: () => {},
});

export const CurrentGroupContextProvider = ({ children }) => {
  const [currentGroup, setCurrentGroup] = useState(SecureLocalStorageManager.get('currentGroup'));
  const [groupLoaded, setGroupLoaded] = useState(false);

  useEffect(() => {
    SecureLocalStorageManager.set('currentGroup', currentGroup);
  }, [currentGroup]);

  return (
    <CurrentGroupContext.Provider
      value={{ currentGroup, setCurrentGroup, groupLoaded, setGroupLoaded }}
    >
      {children}
    </CurrentGroupContext.Provider>
  );
};

CurrentGroupContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
