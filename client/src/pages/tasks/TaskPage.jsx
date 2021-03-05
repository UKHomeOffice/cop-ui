import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigation } from 'react-navi';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useAxios } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import apiHooks from '../../components/form/hooks';
import DisplayForm from '../../components/form/DisplayForm';
import TaskPageSummary from './components/TaskPageSummary';

const TaskPage = ({ taskId }) => {
  const axiosInstance = useAxios();
  const [keycloak] = useKeycloak();
  const navigation = useNavigation();
  const { submitForm } = apiHooks();
  const { t } = useTranslation();
  const { trackPageView } = useMatomo();
  const currentUser = keycloak.tokenParsed.email;
  const [repeat, setRepeat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState();
  const [taskUpdateSubmitted, setTaskUpdateSubmitted] = useState(false);

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    // Reset state so that when task page is reloaded with 'next task' it starts fresh
    const source = axios.CancelToken.source();
    setRepeat(false);
    setSubmitting(false);
    setTask({ isLoading: true, data: null });

    // Get task data
    const loadTask = async () => {
      if (axiosInstance) {
        try {
          const response = await axiosInstance.get(`/ui/tasks/${taskId}`, {
            cancelToken: source.token,
          });
          // If user allowed to view this task, set the task details include the form
          if (response.data.task.assignee === currentUser) {
            setTask({
              isLoading: false,
              data: {
                ...response.data,
              },
            });
          } else {
            setTask({
              isLoading: false,
              data: {
                ...response.data,
                form: '', // force form to null as user should not be able to access it
              },
            });
          }
        } catch {
          setTask({ isLoading: false, data: null });
        }
      }
    };
    loadTask().then(() => {});
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, currentUser, repeat, taskId, taskUpdateSubmitted]);

  const handleOnFailure = () => {
    setSubmitting(false);
  };

  const handleOnRepeat = () => {
    setSubmitting(false);
    setRepeat(true);
    window.scrollTo(0, 0);
  };

  if (task && task.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!task || !task.data) {
    return null;
  }

  return (
    <>
      <TaskPageSummary
        businessKey={task.data.processInstance.businessKey}
        category={task.data.processDefinition.category}
        taskInfo={task.data.task}
        taskUpdateSubmitted={taskUpdateSubmitted}
        setTaskUpdateSubmitted={setTaskUpdateSubmitted}
      />
      {task.data.form ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" id="form">
            <DisplayForm
              submitting={submitting}
              form={task.data.form}
              handleOnCancel={async () => {
                await navigation.navigate('/tasks');
              }}
              existingSubmission={{}}
              interpolateContext={{
                processContext: {
                  /*
                   * Spread 'variables' and keep 'variables' here so processContext has nested properties directly
                   * on processContext. Forms/processes make reference to values that exist on 'variables' that
                   * need to exist on processContext. Forms/processes also make reference to values that need to
                   * exist on 'variables' directly.
                   * i.e. processContext.recordBorderEvent and processContext.variables.recordBorderEvent
                   */
                  ...task.data.variables,
                  variables: task.data.variables,
                  instance: task.data.processInstance,
                  definition: task.data.processDefinition,
                },
                taskContext: task,
              }}
              handleOnSubmit={(submission) => {
                setSubmitting(true);
                submitForm({
                  submission,
                  form: task.data.form,
                  id: taskId,
                  businessKey: task.data.processInstance.businessKey,
                  handleOnFailure,
                  handleOnRepeat,
                  submitPath: 'task',
                });
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <div className="govuk-warning-text">
                <span className="govuk-warning-text__icon" aria-hidden="true">
                  !
                </span>
                <strong className="govuk-warning-text__text">
                  <span className="govuk-warning-text__assistive">{t('warning')}</span>
                  {t('pages.task.no-form')}
                </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

TaskPage.propTypes = {
  taskId: PropTypes.string.isRequired,
};
export default TaskPage;
