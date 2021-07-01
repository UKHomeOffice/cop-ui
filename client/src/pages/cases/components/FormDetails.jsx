import React, { useState, useEffect } from 'react';
import { Details } from 'govuk-frontend';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import gds from '@ukhomeoffice/formio-gds-template';
import { Formio, Form } from 'react-formio';
import { useAxios, useIsMounted } from '../../../utils/hooks';

Formio.use(gds);

const FormDetails = ({ formReferences, businessKey }) => {
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const isMounted = useIsMounted();

  const [form, setForm] = useState({
    formSelected: '',
    isLoading: false,
    data: null,
  });

  const [submissionData, setSubmissionData] = useState(null);
  const [selectedFormInstance, setSelectedFormInstance] = useState(null);

  const fetchForm = async (formName, formVersionId) => {
    if (axiosInstance) {
      try {
        setForm({
          formSelected: formVersionId,
          isLoading: true,
        });
        const { data } = await axiosInstance.get(`/form/name/${formName}`);
        if (isMounted.current) {
          setForm({
            formSelected: formVersionId,
            isLoading: false,
            data,
          });
        }
      } catch (e) {
        if (isMounted.current) {
          setForm({
            formSelected: '',
            isLoading: false,
            data: null,
          });
        }
      }
    }
  };

  const fetchSubmissionData = async (dataPath) => {
    try {
      const resp = await axiosInstance.get(
        `/camunda/cases/${businessKey}/submission?key=${dataPath}`
      );
      setSubmissionData(resp.data);
    } catch (err) {
      setSubmissionData(null);
    }
  };

  useEffect(() => {
    document.querySelectorAll('[data-module="govuk-details"]').forEach((element) => {
      new Details(element).init();
    });
  }, []);

  useEffect(() => {
    if (selectedFormInstance) {
      fetchForm(selectedFormInstance.name, selectedFormInstance.formVersionId);
      fetchSubmissionData(selectedFormInstance.dataPath);
    }
  }, [selectedFormInstance]);

  return (
    <>
      {formReferences
        .sort((a, b) => {
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        })
        .map((formInstance, index) => {
          const formInstanceKey = `${formInstance.formVersionId}-${formInstance.submissionDate}`;
          const selectedFormInstanceKey = selectedFormInstance
            ? `${selectedFormInstance.formVersionId}-${selectedFormInstance.submissionDate}`
            : null;
          const isSelectedFormInstance = formInstanceKey === selectedFormInstanceKey;
          return (
            <React.Fragment key={formInstanceKey}>
              <details
                key={formInstanceKey}
                id={`form${index}`}
                className="govuk-details"
                data-module="govuk-details"
              >
                <summary className="govuk-details__summary">
                  <span className="govuk-details__summary-text">{formInstance.title}</span>
                </summary>
                <div className="govuk-details__text--no-border">
                  <dl className="govuk-summary-list govuk-summary-list--no-border">
                    <div className="govuk-summary-list__row">
                      <dt className="govuk-summary-list__key">Submitted by</dt>
                      <dd className="govuk-summary-list__value">{formInstance.submittedBy}</dd>
                    </div>
                    <div className="govuk-summary-list__row">
                      <dt className="govuk-summary-list__key">Submitted on</dt>
                      <dd className="govuk-summary-list__value">
                        {dayjs(formInstance.submissionDate).format('DD/MM/YYYY HH:mm')}
                      </dd>
                    </div>
                    <div className="govuk-summary-list__row">
                      <dt className="govuk-summary-list__key">
                        {!index && <span className="govuk-tag">Latest</span>}
                      </dt>
                      <dd className="govuk-summary-list__value">
                        <button
                          type="button"
                          className="govuk-button"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedFormInstance(
                              formInstanceKey !== selectedFormInstanceKey ? formInstance : null
                            );
                          }}
                        >
                          {isSelectedFormInstance ? 'Hide Details' : 'Show details'}
                        </button>
                        {form.isLoading && isSelectedFormInstance && (
                          <h4 className="govuk-body">
                            {t('pages.cases.details-panel.case-history.form-loading')}
                          </h4>
                        )}
                        {!form.isLoading && isSelectedFormInstance && (
                          <Form
                            form={form.data}
                            submission={{ data: submissionData }}
                            options={{
                              readOnly: true,
                              noAlerts: true,
                              buttonSettings: {
                                showPrevious: true,
                                showNext: true,
                                showSubmit: false,
                                showCancel: false,
                              },
                            }}
                          />
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>
              </details>
              {index < formReferences.length - 1 ? <hr className="form-seperator" /> : null}
            </React.Fragment>
          );
        })}
    </>
  );
};

FormDetails.propTypes = {
  formReferences: PropTypes.arrayOf(PropTypes.object).isRequired,
  businessKey: PropTypes.string.isRequired,
};

export default FormDetails;
