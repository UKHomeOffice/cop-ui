import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const CurrentGroupContext = createContext({
  currentGroup: undefined,
  setCurrentGroup: () => {},
  groupLoaded: false,
  setGroupLoaded: () => {},
});

export const CurrentGroupContextProvider = ({ children }) => {
  const [currentGroup, setCurrentGroupState] = useState(undefined);
  const [groupLoaded, setGroupLoaded] = useState(false);

  const setCurrentGroup = (group) => {
    localStorage.setItem('currentGroup', JSON.stringify(group));
    setCurrentGroupState(group);
  };

  useEffect(() => {
    setCurrentGroup(JSON.parse(localStorage.getItem('currentGroup')));
  }, []);

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
