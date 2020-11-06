import React from 'react';
import CaseActions from './components/CaseActions';
import CaseAttachments from './components/CaseAttachments';
import CaseHistory from './components/CaseHistory';
import CaseIntro from './components/CaseIntro';
import CaseMetrics from './components/CaseMetrics';

const CaseDetailsPanel = () => {
  return (
    <>
      <div className="govuk-grid-row govuk-card">
        <CaseIntro />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseActions />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseHistory />
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
export default CaseDetailsPanel;
