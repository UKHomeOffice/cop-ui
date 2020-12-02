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
// import apiHooks from './hooks';

const FormPage = ({ formId }) => {
  // const { submitForm } = apiHooks();
  const source = axios.CancelToken.source();
  const axiosInstance = useAxios();
  const { setAlertContext } = useContext(AlertContext);
  const isMounted = useIsMounted();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [form, setForm] = useState({ isLoading: true, data: null, });
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
      } catch (e) {
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
        } catch (e) {
          if (isMounted.current) {
            setForm({
              isLoading: false,
              data: null,
            });
          }
        }
      }
    };

  const handleOnFailure = () => {
    setSubmitting(false);
  };

  const handleFinalSubmit = (submission) => {
    setAlertContext({
      type: 'form-submission',
      status: 'successful',
      message: t('pages.form.submission.success-message'),
      reference: `${submission.data.businessKey}`,
    });
    navigation.navigate('/');
  };

  const startNextTask = (businessKey) => {
    console.log('starting next task', businessKey);
    // check for open tasks for this businessKey
    axiosInstance
      .get(`/camunda/engine-rest/task?processInstanceBusinessKey=${businessKey}`)
      .then((response) => { 
        if (!response.data) {
          handleFinalSubmit(response.data);
        } else {
          console.log(response.data[0].formKey) // response.data is an array, there should not be multiple instances as there are/will be other controls to prevent multiples
          axiosInstance
            .get(`/form/name/peopleEaB`)
            .then((formResponse) => {
              if (isMounted.current) {
                setForm({
                  isLoading: false,
                  data: formResponse.data,
                });
              }
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => { 
        console.log(error) 
        handleOnFailure();
      })
  };

  const submitForm = useCallback((submission, formInfo, id) => {
    const variables = {
      [formInfo.name]: {
        value: JSON.stringify(submission.data),
        type: 'json',
      },
      initiatedBy: {
        value: submission.data.form.submittedBy,
        type: 'string',
      }
    };
    axiosInstance
      .post(`/camunda/engine-rest/process-definition/key/${id}/submit-form`, {
        variables,
        businessKey: submission.data.businessKey,
      })
      .then(async (results) => {
        startNextTask(results.data.businessKey);
      })
      .catch((error) => {
        console.log('error', error)
      });
  });

    

  useEffect(() => {
    loadForm();
    getFormPageTitle();
    // return () => {
    //   source.cancel('cancelling request');
    // };
  }, [axiosInstance, formId, setForm, isMounted, setSubmitting]);

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
