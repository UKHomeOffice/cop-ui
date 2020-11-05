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
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Case actions</h3>
        </div>
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Case history</h3>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="sort">
              Order by
              <select className="govuk-select" id="sort" name="sort">
                <option value="desc">Latest process start date</option>
                <option value="acs">Earliest process start date</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Case attachments</h3>
        </div>
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <div className="govuk-grid-column-full">
          <h3 className="govuk-heading-m">Case metrics</h3>
        </div>
      </div>
    </>
  );
};

export default CaseDetailsPanel;
