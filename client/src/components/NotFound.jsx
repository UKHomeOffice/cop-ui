import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-navi';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="govuk-width-container">
      <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <h1 className="govuk-heading-l">{t('error.page-not-found.title')}</h1>
            <p className="govuk-body">{t('error.page-not-found.check-address')}</p>
            <p className="govuk-body">
              {t('error.page-not-found.paste-address')}{' '}
              <Link href="/" className="govuk-link">
                {t('error.page-not-found.redirect-link')}
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
