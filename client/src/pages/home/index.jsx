import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import Card from './components/Card';
import { useIsMounted, useAxios } from '../../utils/hooks';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();

  const axiosInstance = useAxios();

  const [tasksCount, setTasksCount] = useState({
    isLoading: true,
    count: 0,
  });
  const isMounted = useIsMounted();
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (axiosInstance) {
      axiosInstance({
        method: 'POST',
        url: '/camunda/engine-rest/task/count',
        cancelToken: source.token,
        data: {
          orQueries: [
            {
              candidateGroups: keycloak.tokenParsed.groups,
              assignee: keycloak.tokenParsed.email,
            },
          ],
        },
      })
        .then((response) => {
          if (isMounted.current) {
            setTasksCount({
              isLoading: false,
              count: response.data.count,
            });
          }
        })
        .catch(() => {
          if (isMounted.current) {
            setTasksCount({
              isLoading: false,
              count: 0,
            });
          }
        });
    }

    return () => {
      source.cancel('Cancelling request');
    };
  }, [
    axiosInstance,
    setTasksCount,
    isMounted,
    keycloak.tokenParsed.groups,
    keycloak.tokenParsed.email,
  ]);

  return (
    <div className="govuk-!-margin-top-7">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <span className="govuk-caption-l">{keycloak.tokenParsed.name}</span>
          <h1 className="govuk-heading-l">{t('pages.home.heading')}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <ul className="govuk-list">
          <li>
            <Card
              href="/tasks"
              count={tasksCount.count}
              isLoading={tasksCount.isLoading}
              handleClick={async () => {
                await navigation.navigate('/tasks');
              }}
              footer={t('pages.home.card.tasks.footer')}
              title="tasks assigned to you"
            />
          </li>
        </ul>
      </div>
      <div className="govuk-grid-row">
        <ul className="govuk-list">
          <li>
            <Card
              href="/forms"
              handleClick={async () => {
                await navigation.navigate('/forms');
              }}
              footer={t('pages.home.card.forms.footer')}
              title="Forms"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
