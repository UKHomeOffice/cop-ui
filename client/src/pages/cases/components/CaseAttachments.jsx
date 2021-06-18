import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { useAxios } from '../../../utils/hooks';
import FileService from '../../../utils/FileService';

const CaseAttachments = ({ businessKey }) => {
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const [keycloak] = useKeycloak();
  const [caseAttachments, setCaseAttachments] = useState({
    fetching: true,
    data: [],
  });
  const fileService = new FileService(keycloak);

  const handleDownload = (e, attachment) => {
    e.preventDefault();
    const { url, submittedFilename } = attachment;
    fileService.downloadFile({
      url,
      originalName: submittedFilename,
    });
  };

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchCaseAttachments = async () => {
      if (axiosInstance) {
        try {
          const { data } = await axiosInstance.get(`/files/${businessKey}`, {
            cancelToken: source.token,
          });
          setCaseAttachments({
            fetching: false,
            data,
          });
        } catch {
          setCaseAttachments({
            fetching: false,
            data: [],
          });
        }
      }
    };

    fetchCaseAttachments();
    return () => {
      source.cancel('cancelling request');
    };
  }, [axiosInstance]);

  const { data, fetching } = caseAttachments;
  if (fetching) {
    return (
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">
          {t('pages.cases.details-panel.case-attachments.loading-attachments')}
        </h3>
      </div>
    );
  }
  return (
    <>
      <div className="govuk-grid-column-full">
        <h3 className="govuk-heading-m">
          {t('pages.cases.details-panel.case-attachments.heading')}
        </h3>
        <details className="govuk-details" data-module="govuk-details">
          <summary className="govuk-details__summary">
            <span className="govuk-details__summary-text">
              {t('pages.cases.details-panel.case-attachments.subheading')}
            </span>
          </summary>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">
                  {t('pages.cases.details-panel.case-attachments.table.header-1')}
                </th>
                <th scope="col" className="govuk-table__header">
                  {t('pages.cases.details-panel.case-attachments.table.header-2')}
                </th>
                <th scope="col" className="govuk-table__header">
                  {t('pages.cases.details-panel.case-attachments.table.header-3')}
                </th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {data.length === 0 ? (
                <tr className="govuk-table__row govuk-heading-s govuk-!-margin-top-4">
                  <th scope="row" className="govuk-table__header">
                    {t('pages.cases.details-panel.case-attachments.table.no-attachments')}
                  </th>
                </tr>
              ) : (
                data.map((attachment) => {
                  const { url, submittedFilename, submittedDateTime, submittedEmail } = attachment;
                  return (
                    <tr className="govuk-table__row" key={url}>
                      <th scope="row" className="govuk-table__header">
                        {/* eslint-disable-next-line */}
                        <a
                          className="govuk-link"
                          href="#"
                          onClick={(e) => handleDownload(e, attachment)}
                        >
                          {submittedFilename}
                        </a>
                      </th>
                      <td className="govuk-table__cell">{submittedDateTime}</td>
                      <td className="govuk-table__cell">{submittedEmail}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </details>
      </div>
    </>
  );
};

CaseAttachments.propTypes = {
  businessKey: PropTypes.string.isRequired,
};

export default CaseAttachments;
