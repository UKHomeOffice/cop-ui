import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigation } from 'react-navi';
import _ from 'lodash';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useIsMounted, useAxios } from '../../utils/hooks';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import DisplayForm from '../../components/form/DisplayForm';
import apiHooks from '../../components/form/hooks';
import TaskPageSummary from './components/TaskPageSummary';

const TaskPage = ({ taskId }) => {
  const isMounted = useIsMounted();
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const navigation = useNavigation();
  const [keycloak] = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;
  const [repeat, setRepeat] = useState(false);
  const { submitForm } = apiHooks();
  const [submitting, setSubmitting] = useState(false);
  const [task, setTask] = useState({
    isLoading: true,
    data: null,
  });
  const [taskUpdateSubmitted, setTaskUpdateSubmitted] = useState(false);
  const { trackPageView } = useMatomo();

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
          const taskData = await axiosInstance.get(`/ui/tasks/${taskId}`, {
            cancelToken: source.token,
          });
          // Spread the taskData into seperate variables
          const {
            variables,
            form,
            processInstance,
            processDefinition,
            task: taskInfo,
          } = taskData.data;
          const formVariableSubmissionName = form ? `${form.name}::submissionData` : null;

          if (taskInfo.variables) {
            Object.keys(taskInfo.variables).forEach((key) => {
              if (taskInfo.variables[key].type === 'Json') {
                taskInfo.variables[key] = JSON.parse(taskInfo.variables[key].value);
              } else {
                taskInfo.variables[key] = taskInfo.variables[key].value;
              }
            });
          }

          if (variables) {
            Object.keys(variables).forEach((key) => {
              if (variables[key].type === 'Json') {
                variables[key] = JSON.parse(variables[key].value);
              } else {
                variables[key] = variables[key].value;
              }
            });
          }

          const updatedVariables = _.omit(variables || {}, [
            'submissionData',
            formVariableSubmissionName,
          ]);

          // If user allowed to view this task, set the task details include the form
          if (taskData.data.task.assignee === currentUser) {
            setTask({
              isLoading: false,
              data: {
                variables: updatedVariables,
                form,
                processInstance,
                processDefinition,
                task: taskInfo,
              },
            });
          } else {
            setTask({
              isLoading: false,
              data: {
                variables: updatedVariables,
                form: '', // force form to null as user should not be able to access it
                processInstance,
                processDefinition,
                task: taskInfo,
              },
            });
          }
        } catch (e) {
          setTask({ isLoading: false, data: null });
        }
      }
    };
    loadTask().then(() => {});
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, setTask, isMounted, taskId, currentUser, taskUpdateSubmitted, repeat]);

  if (task.isLoading) {
    return <ApplicationSpinner />;
  }

  if (!task.data) {
    return null;
  }

  const { form, processInstance, task: taskInfo, processDefinition, variables } = task.data;

  const handleOnFailure = () => {
    setSubmitting(false);
  };
  const handleOnRepeat = () => {
    setSubmitting(false);
    setRepeat(true);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <TaskPageSummary
        businessKey={processInstance.businessKey}
        category={processDefinition.category}
        taskInfo={taskInfo}
        taskUpdateSubmitted={taskUpdateSubmitted}
        setTaskUpdateSubmitted={setTaskUpdateSubmitted}
      />
      {form ? (
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full" id="form">
            <DisplayForm
              submitting={submitting}
              localStorageReference={`form-${task.data.form.name}-${taskId}`}
              form={form}
              handleOnCancel={async () => {
                await navigation.navigate('/tasks');
              }}
              interpolateContext={{
                processContext: {
                  /*
                   * Spread 'variables' and keep 'variables' here so processContext has nested properties directly
                   * on processContext. Forms/processes make reference to values that exist on 'variables' that
                   * need to exist on processContext. Forms/processes also make reference to values that need to
                   * exist on 'variables' directly.
                   * i.e. processContext.recordBorderEvent and processContext.variables.recordBorderEvent
                   */
                  ...variables,
                  variables,
                  instance: processInstance,
                  definition: processDefinition,
                },
                taskContext: taskInfo,
              }}
              handleOnSubmit={(submission) => {
                setSubmitting(true);
                submitForm({
                  submission,
                  form,
                  id: taskId,
                  businessKey: processInstance.businessKey,
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
