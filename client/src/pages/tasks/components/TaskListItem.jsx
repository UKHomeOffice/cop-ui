import React from 'react';
import { Link } from 'react-navi';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './TaskListItem.scss';
import { useKeycloak } from '@react-keycloak/web';

dayjs.extend(relativeTime);

const TaskListItem = ({ id, due, name, assignee }) => {
  const [keycloak] = useKeycloak();
  const currentUser = keycloak.tokenParsed.email;

  const isOverDue = () => {
    if (dayjs(due).fromNow().includes('ago')) {
      return (
        <span
          aria-label={`due ${dayjs(due).fromNow()}`}
          className="govuk-!-font-size-19 govuk-!-font-weight-bold overdue"
        >
          {`Overdue ${dayjs(due).fromNow()}`}
        </span>
      );
    } 
      return (
        <span
          aria-label={`due ${dayjs(due).fromNow()}`}
          className="govuk-!-font-size-19 govuk-!-font-weight-bold not-overdue"
        >
          {`Due ${dayjs(due).fromNow()}`}
        </span>
      );
    
  };

  const isAssigned = () => {
    if (!assignee) {
      return 'Unassigned';
    } if (assignee === currentUser) {
      return 'Assigned to you';
    } 
      return assignee;
    
  };

  const handleClaim = (taskId) => {
    return taskId;
  };

  const handleUnclaim = (taskId) => {
    return taskId;
  };

  const canClaimTask = () => {
    if (assignee === null || assignee !== currentUser) {
      return (
        <button
          type="submit"
          id="actionButton"
          className="govuk-button"
          onClick={() => handleClaim(id)}
        >
          Claim
        </button>
      );
    } 
      return (
        <button
          type="submit"
          id="actionButton"
          className="govuk-button"
          onClick={() => handleUnclaim(id)}
        >
          Unclaim
        </button>
      );
    
  };

  return (
    <div className="govuk-grid-row govuk-!-margin-bottom-3">
      <div className="govuk-grid-column-one-half govuk-!-margin-bottom-3">
        <span className="govuk-caption-m">{id}</span>
        <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">
          <Link
            className="govuk-link govuk-!-font-size-19"
            href={`/tasks/${id}`}
            aria-describedby={name}
          >
            {name}
          </Link>
        </span>
      </div>
      <div className="govuk-grid-column-one-half">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third govuk-!-margin-bottom-3">{isOverDue()}</div>
          <div className="govuk-grid-column-one-third govuk-!-margin-bottom-3">
            <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">{isAssigned()}</span>
          </div>
          <div className="govuk-grid-column-one-third claim-task">{canClaimTask()}</div>
        </div>
      </div>
    </div>
  );
};

TaskListItem.defaultProps = {
  assignee: null,
};

TaskListItem.propTypes = {
  id: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  assignee: PropTypes.string,
};

export default TaskListItem;
