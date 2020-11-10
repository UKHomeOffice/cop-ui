import React from 'react';

const NotFound = () => {
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">Page not found</h1>
            <p className="govuk-body">If you typed the web address, check it is correct.</p>
            <p className="govuk-body">
              If you pasted the web address, check you copied the entire address or use the link to
              direct you to the{' '}
              <a href="/dashboard" className="govuk-link">
                COP dashboard
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
