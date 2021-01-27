import React, { useState, useEffect } from 'react';
import { Details } from 'govuk-frontend';
import PropTypes from 'prop-types';
import moment from 'moment';

const FormDetails = ({ formReferences }) => {
  const [snapshot, setSnapshot] = useState({
    formVersionId: null,
    show: false,
  });

  useEffect(() => {
    document.querySelectorAll('[data-module="govuk-details"]').forEach((element) => {
      new Details(element).init();
    });
  });

  return (
    <>
      {formReferences.map((form) => {
        return (
          <details key={form.formVersionId} className="govuk-details" data-module="govuk-details">
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">{form.title}</span>
            </summary>
            <div className="govuk-details__text">
              <dl className="govuk-summary-list govuk-summary-list--no-border">
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Submitted by</dt>
                  <dd className="govuk-summary-list__value">{form.submittedBy}</dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">Submitted on</dt>
                  <dd className="govuk-summary-list__value">
                    {moment(form.submissionDate).format('DD/MM/YYYY HH:mm')}
                  </dd>
                </div>
                <div className="govuk-summary-list__row">
                  <dt className="govuk-summary-list__key">
                    <span className="govuk-tag">Latest</span>
                  </dt>
                  <dd className="govuk-summary-list__value">
                    <button
                      type="button"
                      className="govuk-button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSnapshot({
                          formVersionId: form.formVersionId,
                          show: !snapshot.show,
                        });
                      }}
                    >
                      {snapshot.show ? 'Hide Details' : 'Show details'}
                    </button>
                  </dd>
                </div>
              </dl>
            </div>
          </details>
        );
      })}
    </>
  );
};

FormDetails.propTypes = {
  formReferences: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FormDetails;
