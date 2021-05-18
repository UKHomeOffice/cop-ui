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

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();

  const axiosInstance = useAxios();

  const { currentGroup, setCurrentGroup, groupLoaded } = useContext(CurrentGroupContext)

  const [groupChanging, setGroupChanging] = useState(false)

  const { groups } = useContext(GroupsContext)

  const GROUP_TYPE_ROLE = 2;

  // const [selectedGroup, setSelectedGroup] = useState(currentGroup?.code)

  // console.log(selectedGroup)
  const selectRef = React.createRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    setCurrentGroup(groups.find(group => group.code === selectRef.current.value))
    setGroupChanging(false)
  };

  const [groupTasksCount, setGroupTasksCount] = useState({
    isLoading: true,
    count: 0,
  });
  const [yourTasksCount, setYourTasksCount] = useState({
    isLoading: true,
    count: 0,
  });
  const isMounted = useIsMounted();
  const { trackPageView } = useMatomo();

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

  // console.log(currentGroup)
  
  if (!groupLoaded) { return null }
  if (groupLoaded && !currentGroup) {
    return (
      <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex="-1" data-module="govuk-error-summary">
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          There is a problem
        </h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            <li>
              <a href="#passport-issued-error">Your Team is not set on your profile yet.</a>
            </li>
            <li>
              <a href="#postcode-error">Please contact COP support to add your Team.</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
  return (
    <div className="govuk-!-margin-top-7">
      {!groupChanging && (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <span className="govuk-caption-l">{keycloak.tokenParsed.name}</span>
            <h1 className="govuk-heading-l">{`${currentGroup.displayname} `}
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a
                href="#"
                className="govuk-body govuk-link--no-visited-state"
                onClick={(e) => {
                  e.preventDefault()
                  setGroupChanging(true)
                }}
              >
                change
          </a>
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
                  Select Team
              </label>
                <select
                  className="govuk-select"
                  defaultValue={currentGroup.code}
                  ref={selectRef}
                >
                  {groups.filter(group => {
                    return group.grouptypeid !== GROUP_TYPE_ROLE
                  }).map(group => {
                    return (
                      <option key={group.code} checked={group.code === currentGroup.code} value={group.code}>{group.displayname}</option>
                    )
                  })}
                </select>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="govuk-button govuk-!-margin-left-6" data-module="govuk-button">
                  Save
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
