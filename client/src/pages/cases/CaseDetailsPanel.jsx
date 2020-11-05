import React from 'react';

const CaseDetailsPanel = () => {
  return (
    <>
      <div className="govuk-grid-row govuk-card">
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">BusinessKeyHere</h2>
        </div>
        <div className="govuk-grid-column-one-half">
          <button
            type="button"
            style={{ float: 'right' }}
            className="govuk-button govuk-button--secondary"
          >
            Copy case link
          </button>
        </div>
      </div>
    </>
  );
};

export default CaseDetailsPanel;
