import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropType from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import config from 'react-global-configuration';
import { useHistory } from 'react-navi';
import NotFound from '../NotFound';
import { AlertContext } from '../../utils/AlertContext';

const ApiErrorAlert = ({ errors }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { setAlertContext } = useContext(AlertContext);

  useEffect(() => {
    const unlisten = history.listen(() => {
      setAlertContext(null);
    });
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  if (errors.length === 0) {
    return null;
  }

  const buildMessage = (err) => {
    const { status } = err;
    let errorMessage;
    switch (status) {
      case 409:
        errorMessage = t('error.api.409');
        break;
      case 401:
      case 403:
        errorMessage = t('error.api.401/403');
        break;
      case 400:
        errorMessage = t('error.api.400');
        break;
      default:
        errorMessage = t('error.api.50x');
    }
    return (
      <li key={uuidv4()}>
        <p className="govuk-error-message">{errorMessage}</p>
      </li>
    );
  };

  if (errors.find((error) => error.status === 404)) {
    return <NotFound />;
  }

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="-1"
      data-module="govuk-error-summary"
    >
      <h1 className="govuk-error-summary__title" id="error-summary-title">
        {t('error.api.title')}
      </h1>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">{errors.map(buildMessage)}</ul>
      </div>
      <p className="govuk-body">
        {t('error.api.contact-support-prefix')}{' '}
        <a
          className="govuk-link"
          rel="noopener noreferrer"
          target="_blank"
          href={config.get('serviceDeskUrl')}
        >
          {t('error.api.contact-support-link-text')}
        </a>
        .
      </p>
      <details className="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{t('error.api.details')}</span>
        </summary>
        <div className="govuk-details__text">
          <div className="govuk-error-summary__body">
            <ul className="govuk-list govuk-list--bullet govuk-error-summary__list">
              {errors.map((error) => {
                const { path, status } = error;
                return <li key={uuidv4()}>{t('error.api.error-info', { path, status })}</li>;
              })}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
};

ApiErrorAlert.propTypes = {
  errors: PropType.arrayOf(
    PropType.shape({
      message: PropType.string.isRequired,
      path: PropType.string.isRequired,
      exception: PropType.shape(),
      status: PropType.number.isRequired,
    })
  ).isRequired,
};

export default ApiErrorAlert;
