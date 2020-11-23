import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const TeamContext = createContext({
  team: {},
  setTeam: () => {},
});

export const TeamContextProvider = ({ children }) => {
  const [team, setTeam] = useState(null);

  return <TeamContext.Provider value={{ team, setTeam }}>{children}</TeamContext.Provider>;
};

TeamContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
