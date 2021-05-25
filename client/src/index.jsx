import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/index.scss';
import './i18n';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { TeamContextProvider } from './utils/TeamContext';
import { StaffIdContextProvider } from './utils/StaffIdContext';
import { CurrentGroupContextProvider } from './utils/CurrentGroupContext';
import { GroupsContextProvider } from './utils/GroupsContext';

ReactDOM.render(
  <React.StrictMode>
    <TeamContextProvider>
      <StaffIdContextProvider>
        <CurrentGroupContextProvider>
          <GroupsContextProvider>
            <App />
          </GroupsContextProvider>
        </CurrentGroupContextProvider>
      </StaffIdContextProvider>
    </TeamContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
