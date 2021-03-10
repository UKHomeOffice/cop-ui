import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigation } from 'react-navi';
// eslint-disable-next-line import/no-extraneous-dependencies
import FormioUtils from 'formiojs/utils';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useTranslation } from 'react-i18next';
import { useAxios, useIsMounted } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import apiHooks from '../../components/form/hooks';
import DisplayForm from '../../components/form/DisplayForm';
import SecureLocalStorageManager from '../../utils/SecureLocalStorageManager';
import './Forms.scss';

const FormPage = ({ formId }) => {
  const { t } = useTranslation();
  const { submitForm } = apiHooks();
  const isMounted = useIsMounted();
  const navigation = useNavigation();
  const [repeat, setRepeat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pageHeading, setPageHeading] = useState();

  const [form, setForm] = useState({
    isLoading: true,
    data: null,
  });

  const axiosInstance = useAxios();
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    setRepeat(false);

    const fetchProcessName = async () => {
      if (axiosInstance) {
        try {
          const {
            data: { name },
          } = await axiosInstance.get(`/camunda/engine-rest/process-definition/key/${formId}`, {
            cancelToken: source.token,
          });
          setPageHeading(name);
          document.title = `${name} | ${t('header.service-name')}`;
        } catch (e) {
          setPageHeading();
        }
      }
    };

    const fetchForm = async () => {
      if (axiosInstance) {
        try {
          const {
            data: { key },
          } = await axiosInstance.get(
            `/camunda/engine-rest/process-definition/key/${formId}/startForm`,
            {
              cancelToken: source.token,
            }
          );
          const { data } = await axiosInstance.get(`/form/name/${key}`);
          if (isMounted.current) {
            setForm({
              isLoading: false,
              data,
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

    fetchForm();
    fetchProcessName();
    return () => {
      source.cancel('cancelling request');
    };
  }, [axiosInstance, formId, setForm, isMounted, setSubmitting, repeat]);

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
  const handleOnRepeat = (reference) => {
    setSubmitting(false);
    setRepeat(true);
    SecureLocalStorageManager.remove(reference);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <h1 className="govuk-heading-l">{pageHeading}</h1>
      <DisplayForm
        submitting={submitting}
        localStorageReference={form.data.name}
        form={form.data}
        handleOnCancel={async () => {
          await navigation.navigate('/forms');
        }}
        interpolateContext={{
          businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
        }}
        handleOnSubmit={(data, reference) => {
          setSubmitting(true);
          submitForm({
            submission: data,
            form: form.data,
            id: formId,
            businessKey: businessKeyComponent ? businessKeyComponent.defaultValue : null,
            handleOnFailure,
            handleOnRepeat,
            submitPath: 'process-definition/key',
            reference,
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
