import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const VisitedPagesContext = createContext({
  visitedPages: {},
  setVisitedPages: () => {},
});

export const VisitedPagesContextProvider = ({ children }) => {
  const [visitedPages, setVisitedPages] = useState({});

  return (
    <VisitedPagesContext.Provider value={{ visitedPages, setVisitedPages }}>
      {children}
    </VisitedPagesContext.Provider>
  );
};

VisitedPagesContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
