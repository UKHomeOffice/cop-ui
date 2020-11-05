import React from 'react';
import { useTranslation } from 'react-i18next';

const CaseResultsPanel = () => {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="govuk-heading-m">{t('pages.cases.results-panel.title')}</h2>
      <p className="govuk-body govuk-!-margin-bottom-1">{t('pages.cases.results-panel.caption')}</p>
      <p className="govuk-body govuk-!-font-weight-bold">0</p>
    </>
  );
};

export default CaseResultsPanel;
