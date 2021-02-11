import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const CaseMetrics = ({ caseMetrics, businessKey }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">{t('pages.cases.details-panel.case-metrics.heading')}</h3>
        <details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">{`${t(
              'pages.cases.details-panel.case-metrics.summary'
            )} ${businessKey}`}</span>
          </summary>
          <div className="govuk-grid-row govuk-!-margin-top-4">
            <div className="govuk-grid-column-full">
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body ">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {caseMetrics.noOfRunningProcessInstances}
                      </span>
                      <span className="govuk-!-font-size-19">Open processes</span>
                    </div>
                  </div>
                </div>
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {caseMetrics.noOfCompletedProcessInstances}
                      </span>
                      <span className="govuk-!-font-size-19">Completed processes</span>
                    </div>
                  </div>
                </div>
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body ">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {caseMetrics.noOfCompletedUserTasks}
                      </span>
                      <span className="govuk-!-font-size-19">Completed tasks</span>
                    </div>
                  </div>
                </div>
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body ">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {caseMetrics.noOfOpenUserTasks}
                      </span>
                      <span className="govuk-!-font-size-19">Open tasks</span>
                    </div>
                  </div>
                </div>
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body ">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {dayjs.duration(caseMetrics.overallTimeInSeconds, 'seconds').humanize()}
                      </span>
                      <span className="govuk-!-font-size-19">Total time</span>
                    </div>
                  </div>
                </div>
                <div className="govuk-grid-column-one-third">
                  <div className="metrics-card">
                    <div className="metrics-card-body ">
                      <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">
                        {dayjs
                          .duration(caseMetrics.averageTimeToCompleteProcessInSeconds, 'seconds')
                          .humanize()}
                      </span>
                      <span className="govuk-!-font-size-19">Average process completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
      </div>
    </>
  );
};

CaseMetrics.propTypes = {
  businessKey: PropTypes.string.isRequired,
  caseMetrics: PropTypes.shape({
    averageTimeToCompleteProcessInSeconds: PropTypes.number.isRequired,
    noOfCompletedProcessInstances: PropTypes.number.isRequired,
    noOfCompletedUserTasks: PropTypes.number.isRequired,
    noOfOpenUserTasks: PropTypes.number.isRequired,
    noOfRunningProcessInstances: PropTypes.number.isRequired,
    overallTimeInSeconds: PropTypes.number.isRequired,
  }).isRequired,
};
export default CaseMetrics;
