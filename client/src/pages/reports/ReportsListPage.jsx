import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import _ from 'lodash';
import { useAxios } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import './ReportsListPage.scss';

const ReportsListPage = () => {
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const [reports, setReports] = useState({
    isLoading: true,
    data: [],
  });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const loadReports = async () => {
      if (axiosInstance) {
        try {
          const response = await axiosInstance.get('/reports/api/reports', {
            cancelToken: source.token,
          });
          setReports({
            isLoading: false,
            data: response.data,
            total: response.data.length,
          });
        } catch (e) {
          setReports({
            isLoading: false,
            data: [],
            total: 0,
          });
        }
      }
    };

    loadReports();

    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance]);

  return reports.isLoading ? (
    <ApplicationSpinner />
  ) : (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <span className="govuk-caption-l">
            {t('pages.reports.list.size', { count: reports.data.length })}
          </span>
          <h1 className="govuk-heading-l">{t('pages.reports.list.heading')}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <ul className="govuk-list reports">
            {reports.data.map(({ id, name }) => {
              const href = `/reports/${_.kebabCase(name)}`;
              return (
                <li key={id || name} className="list-item">
                  <a
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigation.navigate(href);
                    }}
                    className="govuk-link"
                    href={href}
                  >
                    {name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ReportsListPage;
