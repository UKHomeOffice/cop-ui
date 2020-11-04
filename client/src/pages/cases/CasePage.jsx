import React from 'react';
import { useTranslation } from 'react-i18next';
import './CasesPage.scss';

const CasePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">{t('pages.cases.caption')}</span>
          <h1 className="govuk-heading-l">{t('pages.cases.heading')}</h1>
          <div className="govuk-inset-text">
            <p>{t('pages.cases.heading-help')}</p>
            <p>
              <strong>{t('pages.cases.heading-warning')}</strong>
            </p>
          </div>
        </div>
        <div className="govuk-grid-column-one-third">
          <div className="govuk-form-group">
            <input
              // onChange={(e) => {
              //   search(e.target.value);
              // }}
              spellCheck="false"
              className="govuk-input search__input"
              placeholder={t('pages.cases.list.search-placeholder')}
              id="bfNumber"
              name="search"
              type="text"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CasePage;
