import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const StaffIdContext = createContext({
  staffId: {},
  setStaffId: () => {},
});

export const StaffIdContextProvider = ({ children }) => {
  const [staffId, setStaffId] = useState(null);

  return (
    <StaffIdContext.Provider value={{ staffId, setStaffId }}>{children}</StaffIdContext.Provider>
  );
};

StaffIdContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
