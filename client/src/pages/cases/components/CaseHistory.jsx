import React from 'react';
import { useTranslation } from 'react-i18next';

const CaseHistory = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">{t('pages.cases.details-panel.case-history.heading')}</h3>
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            {t('pages.cases.details-panel.case-history.select-input-order')}
            <select
              className="govuk-select govuk-!-display-block govuk-!-margin-top-1"
              id="sort"
              name="sort"
            >
              <option value="desc">
                {t('pages.cases.details-panel.case-history.select-input-latest')}
              </option>
              <option value="acs">
                {t('pages.cases.details-panel.case-history.select-input-earliest')}
              </option>
            </select>
          </label>
        </div>
        <div id="businessKey" className="govuk-accordion" data-module="govuk-accordion">
          <div className="govuk-accordion__section">
            <div className="govuk-accordion__section-header">
              <h4 className="govuk-accordion__section-heading">
                <span className="govuk-accordion__section-button" id="id" />
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CaseHistory;
