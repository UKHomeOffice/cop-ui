import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-navi';
import ChangePriority from './ChangePriority';
import ChangeDueDate from './ChangeDueDate';

const TaskPageSummary = ({
  businessKey,
  category,
  taskInfo,
  taskUpdateSubmitted,
  setTaskUpdateSubmitted,
}) => {
  const [keycloak] = useKeycloak();
  const { t } = useTranslation();
  const [assigneeText, setAssigneeText] = useState();
  const currentUser = keycloak.tokenParsed.email;
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [isEditingDueDate, setIsEditingDueDate] = useState(false);

  const handlePriorityEdit = () => {
    setIsEditingPriority(!isEditingPriority);
  };
  const handleDueDateEdit = () => {
    setIsEditingDueDate(!isEditingDueDate);
  };

  useEffect(() => {
    if (taskInfo && !taskInfo.assignee) {
      setAssigneeText(t('pages.task.unassigned'));
    } else if (taskInfo && taskInfo.assignee === currentUser) {
      setAssigneeText(t('pages.task.current-assignee'));
    } else {
      setAssigneeText(taskInfo.assignee);
    }
  }, [taskInfo]);

  if (!taskInfo) {
    return null;
  }

  return (
    <>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="taskName">
          <span className="govuk-caption-l">
            <Link
              className="govuk-link"
              target="_blank"
              rel="noopener noreferrer"
              href={`/cases/${businessKey}`}
            >
              {businessKey}
            </Link>
          </span>
          <h1 className="govuk-heading-l">{taskInfo.name}</h1>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter" id="category">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.category')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{category}</h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskDueDate">
          <span className="govuk-caption-m govuk-!-font-size-19">
            {t('pages.task.due')}
            &nbsp; (
            <button
              className="govuk-accordion__open-all"
              aria-hidden="true"
              type="button"
              onClick={handleDueDateEdit}
              onKeyDown={handleDueDateEdit}
            >
              {isEditingDueDate ? 'cancel' : 'change'}
            </button>
            )
          </span>
          <ChangeDueDate
            isEditingDueDate={isEditingDueDate}
            taskInfo={taskInfo}
            taskUpdateSubmitted={taskUpdateSubmitted}
            setTaskUpdateSubmitted={setTaskUpdateSubmitted}
          />
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskPriority">
          <span className="govuk-caption-m govuk-!-font-size-19">
            {t(`pages.task.priority`)}
            &nbsp; (
            <button
              className="govuk-accordion__open-all"
              aria-hidden="true"
              type="button"
              onClick={handlePriorityEdit}
              onKeyDown={handlePriorityEdit}
            >
              {isEditingPriority ? 'cancel' : 'change'}
            </button>
            )
          </span>
          <ChangePriority
            isEditingPriority={isEditingPriority}
            taskInfo={taskInfo}
            taskUpdateSubmitted={taskUpdateSubmitted}
            setTaskUpdateSubmitted={setTaskUpdateSubmitted}
          />
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskAssignee">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.assignee')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{assigneeText}</h4>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="description">
          <p className="govuk-body">{taskInfo.description}</p>
        </div>
      </div>
    </>
  );
};

TaskPageSummary.defaultProps = {
  taskInfo: {
    description: '',
  },
};

TaskPageSummary.propTypes = {
  businessKey: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  taskInfo: PropTypes.shape({
    assignee: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    due: PropTypes.string.isRequired,
  }),
  taskUpdateSubmitted: PropTypes.bool.isRequired,
  setTaskUpdateSubmitted: PropTypes.func.isRequired,
};

export default TaskPageSummary;
