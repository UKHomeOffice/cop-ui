import React from 'react';
import PropTypes from 'prop-types';
import CaseActions from './components/CaseActions';
import CaseAttachments from './components/CaseAttachments';
import CaseHistory from './components/CaseHistory';
import CaseIntro from './components/CaseIntro';
import CaseMetrics from './components/CaseMetrics';

const CaseDetailsPanel = ({
  businessKey,
  processInstances,
  caseMetrics,
  caseActions,
  getCaseDetails,
}) => {
  return (
    <>
      <div className="govuk-grid-row govuk-card">
        <CaseIntro businessKey={businessKey} />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseActions
          caseActions={caseActions}
          businessKey={businessKey}
          getCaseDetails={getCaseDetails}
        />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseHistory processInstances={processInstances} businessKey={businessKey} />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseAttachments businessKey={businessKey} />
      </div>
      <div className="govuk-grid-row govuk-card govuk-!-margin-top-4">
        <CaseMetrics caseMetrics={caseMetrics} businessKey={businessKey} />
      </div>
    </>
  );
};

CaseDetailsPanel.propTypes = {
  businessKey: PropTypes.string.isRequired,
  getCaseDetails: PropTypes.func.isRequired,
  processInstances: PropTypes.arrayOf(PropTypes.object).isRequired,
  caseMetrics: PropTypes.shape({
    averageTimeToCompleteProcessInSeconds: PropTypes.number.isRequired,
    noOfCompletedProcessInstances: PropTypes.number.isRequired,
    noOfCompletedUserTasks: PropTypes.number.isRequired,
    noOfOpenUserTasks: PropTypes.number.isRequired,
    noOfRunningProcessInstances: PropTypes.number.isRequired,
    overallTimeInSeconds: PropTypes.number.isRequired,
  }).isRequired,
  caseActions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CaseDetailsPanel;
