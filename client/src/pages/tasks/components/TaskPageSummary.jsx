import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-navi';
import moment from 'moment';
import ChangePriority from './ChangePriority';

const TaskPageSummary = ({
  businessKey,
  category,
  assignee,
  taskInfo,
  taskUpdateSubmitted,
  setTaskUpdateSubmitted,
}) => {
  const { t } = useTranslation();
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const handlePriorityEdit = () => {
    setIsEditingPriority(!isEditingPriority);
  };

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
          <h2 className="govuk-heading-l">{taskInfo.name}</h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter" id="category">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.category')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{category}</h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskDueDate">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.due')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">
            {moment().to(moment(taskInfo.due))}
          </h4>
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
            <ChangePriority
              isEditingPriority={isEditingPriority}
              taskInfo={taskInfo}
              taskUpdateSubmitted={taskUpdateSubmitted}
              setTaskUpdateSubmitted={setTaskUpdateSubmitted}
            />
          </span>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskAssignee">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.assignee')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{assignee}</h4>
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
  assignee: '',
  taskInfo: {
    description: '',
  },
};

TaskPageSummary.propTypes = {
  businessKey: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  assignee: PropTypes.string,
  taskInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    due: PropTypes.string.isRequired,
  }),
  taskUpdateSubmitted: PropTypes.bool.isRequired,
  setTaskUpdateSubmitted: PropTypes.func.isRequired,
};

export default TaskPageSummary;
