import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const GroupsContext = createContext({
  groups: {},
  setGroups: () => {},
});

export const GroupsContextProvider = ({ children }) => {
  const [groups, setGroups] = useState({});

  return <GroupsContext.Provider value={{ groups, setGroups }}>{children}</GroupsContext.Provider>;
};

GroupsContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
