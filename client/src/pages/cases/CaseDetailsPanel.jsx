import React from 'react';
import PropTypes from 'prop-types';

import CaseActions from './components/CaseActions';
import CaseAttachments from './components/CaseAttachments';
import CaseHistory from './components/CaseHistory';
import CaseIntro from './components/CaseIntro';
import CaseMetrics from './components/CaseMetrics';

const CaseDetailsPanel = ({ caseSelected }) => {
  return (
    <>
      <div className="govuk-grid-row govuk-card">
        <CaseIntro businessKey={caseSelected.businessKey} />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseActions />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseHistory caseSelected={caseSelected} />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseAttachments />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseMetrics />
      </div>
    </>
  );
};

CaseDetailsPanel.propTypes = {
  caseSelected: PropTypes.node.isRequired,
};

export default CaseDetailsPanel;
