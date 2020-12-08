import React, { useState } from 'react';
import { Link, useNavigation } from 'react-navi';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { useKeycloak } from '@react-keycloak/web';
import { useAxios } from '../../../utils/hooks';
import './TaskListItem.scss';

dayjs.extend(relativeTime);

const TaskListItem = ({ id, due, name, assignee, businessKey }) => {
  const axiosInstance = useAxios();
  const [keycloak] = useKeycloak();
  const navigation = useNavigation();
  const currentUser = keycloak.tokenParsed.email;
  const [unclaimActionMade, setUnclaimActionMade] = useState(false);

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
    if (!assignee || unclaimActionMade) {
      return 'Unassigned';
    }
    if (assignee === currentUser) {
      return 'Assigned to you';
    }
    return assignee;
  };
  const handleClaim = async () => {
    const source = axios.CancelToken.source();
    await axiosInstance({
      method: 'POST',
      url: `/camunda/engine-rest/task/${id}/claim`,
      cancelToken: source.token,
      data: {
        userId: currentUser,
      },
    }).then(() => navigation.navigate(`/tasks/${id}`));
  };
  const handleUnclaim = async (e) => {
    const source = axios.CancelToken.source();
    e.persist();
    await axiosInstance({
      method: 'POST',
      url: `/camunda/engine-rest/task/${id}/unclaim`,
      cancelToken: source.token,
    }).then(() => {
      setUnclaimActionMade(true);
      e.target.blur();
    });
  };
  const canClaimTask = () => {
    if (assignee === null || assignee !== currentUser || unclaimActionMade) {
      return (
        <button type="submit" id="actionButton" className="govuk-button" onClick={handleClaim}>
          Claim
        </button>
      );
    }
    return (
      <button type="submit" id="actionButton" className="govuk-button" onClick={handleUnclaim}>
        Unclaim
      </button>
    );
  };

  return (
    <div className="govuk-grid-row govuk-!-margin-bottom-3">
      <div className="govuk-grid-column-one-half govuk-!-margin-bottom-3">
        <span className="govuk-caption-m">{businessKey}</span>
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
  businessKey: PropTypes.string.isRequired,
};

export default TaskListItem;
