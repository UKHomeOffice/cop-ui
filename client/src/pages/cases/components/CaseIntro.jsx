import React from 'react';
import { useTranslation } from 'react-i18next';

const CaseIntro = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="govuk-grid-column-one-half">
        <h2 className="govuk-heading-m">Case</h2>
      </div>
      <div className="govuk-grid-column-one-half">
        <button
          type="button"
          style={{ float: 'right' }}
          className="govuk-button govuk-button--secondary"
        >
          {t('pages.cases.details-panel.case-intro.copy-button')}
        </button>
      </div>
    </>
  );
};
export default CaseIntro;
