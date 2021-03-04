import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CaseIntro = ({ businessKey }) => {
  const { t } = useTranslation();
  const [caseUrlCopied, setCaseUrlCopied] = useState(false);

  return (
    <>
      <div className="govuk-grid-column-one-half">
        <h2 className="govuk-heading-m">{businessKey}</h2>
      </div>
      <div className="govuk-grid-column-one-half">
        <CopyToClipboard
          text={`${window.location.origin}/cases/${businessKey}`}
          onCopy={() => setCaseUrlCopied(true)}
        >
          <button
            type="button"
            style={{ float: 'right' }}
            className="govuk-button govuk-button--secondary"
          >
            {caseUrlCopied
              ? t('pages.cases.details-panel.case-intro.copy-button-copied')
              : t('pages.cases.details-panel.case-intro.copy-button-uncopied')}
          </button>
        </CopyToClipboard>
      </div>
    </>
  );
};

CaseIntro.propTypes = {
  businessKey: PropTypes.string.isRequired,
};
export default CaseIntro;
