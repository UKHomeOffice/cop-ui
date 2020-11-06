import React from 'react';

const CaseHistory = () => {
  return (
    <>
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">Case history</h3>
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            Order by
            <select
              className="govuk-select govuk-!-display-block govuk-!-margin-top-1"
              id="sort"
              name="sort"
            >
              <option value="desc">Latest process start date</option>
              <option value="acs">Earliest process start date</option>
            </select>
          </label>
        </div>
        <div id="businessKey" className="govuk-accordion" data-module="govuk-accordion">
          <div className="govuk-accordion__section">
            <div className="govuk-accordion__section-header">
              <h4 className="govuk-accordion__section-heading">
                <span className="govuk-accordion__section-button" id="id">
                  example title
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseHistory;
