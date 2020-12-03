import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormioUtils from 'formiojs/utils';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import DisplayForm from '../../components/form/DisplayForm';
import { AlertContext } from '../../utils/AlertContext';
import { useAxios, useIsMounted } from '../../utils/hooks';

const FormPage = ({ formId }) => {
  const source = axios.CancelToken.source();
  const axiosInstance = useAxios();
  const { setAlertContext } = useContext(AlertContext);
  const isMounted = useIsMounted();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [form, setForm] = useState({ isLoading: true, data: null });
  const [pageTitle, setPageTitle] = useState();
  const [submitting, setSubmitting] = useState(false);

  const getFormPageTitle = async () => {
    if (axiosInstance) {
      try {
        const formName = await axiosInstance.get(
          `/camunda/engine-rest/process-definition/key/${formId}`,
          {
            cancelToken: source.token,
          }
        );
        if (formName && formName.data) {
          setPageTitle(formName.data.name);
        }
      } catch (error) {
        setPageTitle();
      }
    }
  };

  const loadForm = async () => {
    if (axiosInstance) {
      try {
        const formKey = await axiosInstance.get(
          `/camunda/engine-rest/process-definition/key/${formId}/startForm`,
          {
            cancelToken: source.token,
          }
        );
        if (formKey && formKey.data) {
          const { key } = formKey.data;
          const formResponse = await axiosInstance.get(`/form/name/${key}`);
          if (isMounted.current) {
            setForm({
              isLoading: false,
              data: formResponse.data,
            });
          }
        } else {
          setForm({
            isLoading: false,
            data: null,
          });
        }
      } catch (error) {
        if (isMounted.current) {
          setForm({
            isLoading: false,
            data: null,
          });
        }
      }
    }
  };

  /* Some forms have connected forms that should be triggered immediately for the user to complete
  This function checks for and handles those.
 */
  const startNextTask = async (businessKey) => {
    if (axiosInstance) {
      // Check for any open tasks for this processInstance (businessKey)
      try {
        const nextTask = await axiosInstance.get(
          `/camunda/engine-rest/task?processInstanceBusinessKey=${businessKey}`,
          {
            cancelToken: source.token,
          }
        );
        if (!nextTask.data) {
          // If there are no open tasks then we can end this flow for the user
          setAlertContext({
            type: 'form-submission',
            status: 'successful',
            message: t('pages.form.submission.success-message'),
            reference: `${businessKey}`,
          });
          navigation.navigate('/');
        } else {
          console.log(nextTask.data);
          // If there are open tasks, we load the form for the task
          const formResponse = await axiosInstance.get(`/form/name/peopleEaB`);
          if (formResponse && formResponse.data) {
            if (isMounted.current) {
              setForm({
                isLoading: false,
                data: formResponse.data,
              });
            }
          } else {
            setForm({
              isLoading: false,
              data: null,
            });
          }
        }
      } catch (error) {
        if (isMounted.current) {
          setForm({
            isLoading: false,
            data: null,
          });
        }
      }
    }
  };

  /* The submitForm was using a different syntax for the api calls
  It seems to be due to the 'useCallback' feature, as you cannot use 'async/await' with that
  */
  const submitForm = useCallback((submission, formInfo, id) => {
    const variables = {
      [formInfo.name]: {
        value: JSON.stringify(submission.data),
        type: 'json',
      },
      initiatedBy: {
        value: submission.data.form.submittedBy,
        type: 'string',
      },
    };
    axiosInstance
      .post(`/camunda/engine-rest/process-definition/key/${id}/submit-form`, {
        variables,
        businessKey: submission.data.businessKey,
      })
      .then(async (results) => {
        startNextTask(results.data.businessKey);
      })
      .catch(() => {
        setSubmitting(false);
      });
  });

  useEffect(() => {
    getFormPageTitle();
    loadForm();
  }, [axiosInstance, formId, setForm, isMounted]);

  if (form.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!form.data) {
    return null;
  }
  const businessKeyComponent = FormioUtils.getComponent(form.data.components, 'businessKey');

  return (
    <>
      <h1 className="govuk-heading-l">{pageTitle}</h1>
      <DisplayForm
        submitting={submitting}
        handleOnCancel={async () => {
          await navigation.navigate('/forms');
        }}
        interpolateContext={{
          businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
        }}
        form={form.data}
        handleOnSubmit={(data) => {
          setSubmitting(true);
          submitForm(data, form.data, formId, () => {
            setSubmitting(false);
          });
        }}
      />
    </>
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
