import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigation } from 'react-navi';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormioUtils from 'formiojs/utils';
import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import apiHooks from '../../components/form/hooks';
import DisplayForm from '../../components/form/DisplayForm';

const FormPage = ({ formId }) => {
  const { submitForm } = apiHooks();
  const isMounted = useIsMounted();
  const navigation = useNavigation();
  const [submitting, setSubmitting] = useState(false);
  const [pageTitle, setPageTitle] = useState();

  const [form, setForm] = useState({
    isLoading: true,
    data: null,
  });

  const axiosInstance = useAxios();

  useEffect(() => {
    const source = axios.CancelToken.source();

    const formPageTitle = async () => {
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

    loadForm().then(() => {});
    formPageTitle();
    return () => {
      source.cancel('cancelling request');
    };
  }, [axiosInstance, formId, setForm, isMounted, setSubmitting]);

  if (form.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!form.data) {
    return null;
  }
  const businessKeyComponent = FormioUtils.getComponent(form.data.components, 'businessKey');
  const handleOnFailure = () => {
    setSubmitting(false);
  };

  return (
    <>
      <h1 className="govuk-heading-l">{pageTitle}</h1>
      <DisplayForm
        submitting={submitting}
        form={form.data}
        handleOnCancel={async () => {
          await navigation.navigate('/forms');
        }}
        interpolateContext={{
          businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
        }}
        handleOnSubmit={(data) => {
          setSubmitting(true);
          submitForm({
            submission: data,
            form: form.data,
            id: formId,
            businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
            handleOnFailure,
            submitPath: 'process-definition/key'
          })
        }}
      />
    </>
  );
};

FormPage.propTypes = {
  formId: PropTypes.string.isRequired,
};
export default FormPage;
