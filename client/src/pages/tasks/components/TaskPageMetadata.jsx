import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-navi';

const TaskPageMetadata = ({
  businessKey,
  name,
  category,
  dueDate,
  priority,
  assignee,
  description,
}) => {
  const { t } = useTranslation();

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
          <h2 className="govuk-heading-l">{name}</h2>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-quarter" id="category">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.category')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{category}</h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskDueDate">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.due')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{dueDate}</h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskPriority">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.priority')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{priority}</h4>
        </div>
        <div className="govuk-grid-column-one-quarter" id="taskAssignee">
          <span className="govuk-caption-m govuk-!-font-size-19">{t('pages.task.assignee')}</span>
          <h4 className="govuk-heading-m govuk-!-font-size-19">{assignee}</h4>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full" id="description">
          <p className="govuk-body">{description}</p>
        </div>
      </div>
    </>
  );
};

TaskPageMetadata.defaultProps = {
  assignee: '',
  description: '',
};

TaskPageMetadata.propTypes = {
  businessKey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  assignee: PropTypes.string,
  description: PropTypes.string,
};

export default TaskPageMetadata;
