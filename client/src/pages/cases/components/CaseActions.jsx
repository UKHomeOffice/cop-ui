import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Accordion } from 'govuk-frontend';
import CaseAction from './CaseAction';

const CaseActions = ({ caseActions, businessKey, getCaseDetails }) => {
  const { t } = useTranslation();
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedActionId, setSelectedActionId] = useState('');
  const [selectedActionCompletionMessage, setSelectedActionCompletionMessage] = useState('');
  const [selectedActionProcessId, setSelectedActionProcessId] = useState('');

  useEffect(() => {
    new Accordion(document.getElementById(`caseActions-${businessKey}`)).init();
    if (caseActions.length) {
      setSelectedAction(caseActions[0].process.formKey);
      setSelectedActionId(caseActions[0].process['process-definition'].key);
      setSelectedActionCompletionMessage(caseActions[0].completionMessage);
      setSelectedActionProcessId(caseActions[0].process['process-definition'].id);
    }
  }, []);

  return (
    <>
      <div className="govuk-grid-column-full">
        <div
          id={`caseActions-${businessKey}`}
          className="govuk-accordion"
          data-module="govuk-accordion"
        >
          <div className="govuk-accordion__section">
            <div className="govuk-accordion__section-header">
              <h4 className="govuk-accordion__section-heading">
                <span
                  className="govuk-accordion__section-button"
                  id={`heading-caseActions-${businessKey}`}
                >
                  {t('pages.cases.details-panel.case-actions.heading')}
                </span>
              </h4>
            </div>
            <div
              id={`accordion-with-summary-sections-content-${businessKey}-actions`}
              className="govuk-accordion__section-content"
              aria-labelledby={`accordion-with-summary-sections-heading-${businessKey}-actions`}
            >
              {caseActions.length ? (
                <div className="govuk-tabs" data-module="govuk-tabs">
                  <ul className="govuk-tabs__list">
                    {caseActions.map((action) => {
                      const { formKey } = action.process;
                      return (
                        <li
                          key={formKey}
                          className={`govuk-tabs__list-item ${
                            selectedAction === formKey ? ' govuk-tabs__list-item--selected' : ''
                          }`}
                        >
                          <a
                            className="govuk-tabs__tab"
                            href={`#${formKey}`}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedAction(formKey);
                              setSelectedActionId(action.process['process-definition'].key);
                              setSelectedActionCompletionMessage(action.completionMessage);
                            }}
                          >
                            {action.process['process-definition'].name}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  {selectedAction ? (
                    <section className="govuk-tabs__panel">
                      <CaseAction
                        selectedAction={selectedAction}
                        businessKey={businessKey}
                        selectedActionId={selectedActionId}
                        selectedActionCompletionMessage={selectedActionCompletionMessage}
                        getCaseDetails={getCaseDetails}
                        selectedActionProcessId={selectedActionProcessId}
                      />
                    </section>
                  ) : null}
                </div>
              ) : (
                <h4 className="govuk-heading-s">No actions available</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
CaseActions.propTypes = {
  businessKey: PropTypes.string.isRequired,
  caseActions: PropTypes.arrayOf(PropTypes.object).isRequired,
  getCaseDetails: PropTypes.func.isRequired,
};
export default CaseActions;
