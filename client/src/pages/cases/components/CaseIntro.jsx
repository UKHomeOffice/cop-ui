import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CaseIntro = ({ businessKey }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="govuk-grid-column-one-half">
        <h2 className="govuk-heading-m">{businessKey}</h2>
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

CaseIntro.propTypes = {
  businessKey: PropTypes.string.isRequired,
};
export default CaseIntro;
