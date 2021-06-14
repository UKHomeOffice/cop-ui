import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from 'react-navi';
import { useKeycloak } from '@react-keycloak/web';
import axios from 'axios';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import Card from './components/Card';
import { useIsMounted, useAxios } from '../../utils/hooks';
import SecureLocalStorageManager from '../../utils/SecureLocalStorageManager';
import { CurrentGroupContext } from '../../utils/CurrentGroupContext';
import { GroupsContext } from '../../utils/GroupsContext';

const GROUP_TYPE_ROLE = 2;

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();
  const axiosInstance = useAxios();
  const { currentGroup, setCurrentGroup, groupLoaded } = useContext(CurrentGroupContext);
  const [groupChanging, setGroupChanging] = useState(false);
  const { groups } = useContext(GroupsContext);
  const selectRef = React.createRef();
  const isMounted = useIsMounted();
  const { trackPageView } = useMatomo();

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentGroup(groups.find((group) => group.code === selectRef.current.value));
    setGroupChanging(false);
  };

  const [groupTasksCount, setGroupTasksCount] = useState({
    isLoading: true,
    count: 0,
  });

  const [yourTasksCount, setYourTasksCount] = useState({
    isLoading: true,
    count: 0,
  });

  useEffect(() => {
    trackPageView();
  }, []);

  /*
   * Whenever a user returns to the dashboard we want to clear any form data from localStorage
   * This currently also clears form data from a successfully submitted form as they return a user to the Dashboard
   */
  useEffect(() => {
    const removeArray = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf('form') !== -1) {
        removeArray.push(localStorage.key(i));
      }
    }
    removeArray.forEach((item) => SecureLocalStorageManager.remove(item));
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (axiosInstance && currentGroup) {
      axiosInstance({
        method: 'POST',
        url: '/camunda/engine-rest/task/count',
        cancelToken: source.token,
        data: {
          orQueries: [
            {
              candidateGroups: [currentGroup.code],
              includeAssignedTasks: true,
            },
          ],
        },
      })
        .then((response) => {
          if (isMounted.current) {
            setGroupTasksCount({
              isLoading: false,
              count: response.data.count,
            });
          }
        })
        .catch(() => {
          if (isMounted.current) {
            setGroupTasksCount({
              isLoading: false,
              count: 0,
            });
          }
        });
      axiosInstance({
        method: 'POST',
        url: '/camunda/engine-rest/task/count',
        cancelToken: source.token,
        data: {
          orQueries: [
            {
              involvedUser: keycloak.tokenParsed.email,
            },
          ],
        },
      })
        .then((response) => {
          if (isMounted.current) {
            setYourTasksCount({
              isLoading: false,
              count: response.data.count,
            });
          }
        })
        .catch(() => {
          if (isMounted.current) {
            setYourTasksCount({
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
    currentGroup,
    setGroupTasksCount,
    setYourTasksCount,
    isMounted,
    keycloak.tokenParsed.groups,
    keycloak.tokenParsed.email,
  ]);

  if (!groupLoaded) {
    return null;
  }
  if (groupLoaded && !currentGroup) {
    return (
      <div className="govuk-grid-row govuk-!-margin-top-7">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">{t('pages.groups.error-heading')}</h1>
          <p className="govuk-body">{t('pages.groups.user-has-no-group')}</p>
          <p className="govuk-body">
            <a
              href="https://lssiprod.service-now.com/ess"
              className="govuk-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('pages.groups.support-link')}
            </a>
            {t('pages.groups.support-link-message')}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="govuk-!-margin-top-7">
      {!groupChanging && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <span className="govuk-caption-l">{keycloak.tokenParsed.name}</span>
            <h1 className="govuk-heading-l">
              {`${currentGroup.displayname} `}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              {groups && groups.length > 1 && (
                <a
                  href="#change-group"
                  className="govuk-body govuk-link--no-visited-state"
                  onClick={(e) => {
                    e.preventDefault();
                    setGroupChanging(true);
                  }}
                >
                  {t('pages.groups.change-group')}
                </a>
              )}
            </h1>
          </div>
        </div>
      )}
      {groupChanging && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <form>
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="sort">
                  {t('pages.groups.select-group')}
                </label>
                <select className="govuk-select" ref={selectRef}>
                  {groups
                    .filter((group) => group.grouptypeid !== GROUP_TYPE_ROLE)
                    .map((group) => (
                      <option
                        key={group.code}
                        selected={group.code === currentGroup.code}
                        value={group.code}
                      >
                        {group.displayname}
                      </option>
                    ))}
                </select>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="govuk-button govuk-!-margin-left-6"
                  data-module="govuk-button"
                >
                  {t('pages.groups.save-group')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="govuk-grid-row">
        <ul className="govuk-list">
          <li>
            <Card
              title={t('pages.home.card.tasks.title')}
              href="/tasks/your-tasks"
              count={yourTasksCount.count}
              isLoading={yourTasksCount.isLoading}
              handleClick={async () => {
                await navigation.navigate('/tasks/your-tasks');
              }}
              footer={t('pages.home.card.tasks.footer')}
            />
          </li>
          <li>
            <Card
              title={t('pages.home.card.group-tasks.title')}
              href="/tasks"
              count={groupTasksCount.count}
              isLoading={groupTasksCount.isLoading}
              handleClick={async () => {
                await navigation.navigate('/tasks');
              }}
              footer={t('pages.home.card.group-tasks.footer')}
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
              title={t('pages.home.card.forms.title')}
            />
          </li>
          <li>
            <Card
              title={t('pages.home.card.cases.title')}
              href="/cases"
              handleClick={async () => {
                await navigation.navigate('/cases');
              }}
              footer={t('pages.home.card.cases.footer')}
            />
          </li>
          <li>
            <Card
              title={t('pages.home.card.reports.title')}
              href="/reports"
              handleClick={async () => {
                await navigation.navigate('/reports');
              }}
              footer={t('pages.home.card.reports.footer')}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
