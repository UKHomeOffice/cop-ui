import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAxios } from '../../../utils/hooks';
import determinePriority from '../../../utils/priority';
import { cleanSubmissionData } from './utils';

const ChangePriority = ({
  isEditingPriority,
  taskInfo,
  taskUpdateSubmitted,
  setTaskUpdateSubmitted,
}) => {
  const axiosInstance = useAxios();
  const [updatedTaskInfo, setUpdatedTaskInfo] = useState(taskInfo);

  const submitPriorityChange = async (e) => {
    e.preventDefault();
    const cleanedData = cleanSubmissionData(updatedTaskInfo);
    const source = axios.CancelToken.source();
    await axiosInstance({
      method: 'PUT',
      url: `/camunda/engine-rest/task/${taskInfo.id}`,
      cancelToken: source.token,
      data: cleanedData,
    });
    setTaskUpdateSubmitted(!taskUpdateSubmitted);
  };
  const handlePriorityChange = (e) => {
    setUpdatedTaskInfo({ ...updatedTaskInfo, priority: parseInt(e.target.value, 10) });
  };

  if (!isEditingPriority) {
    return (
      <h4 className="govuk-heading-m govuk-!-font-size-19">
        {determinePriority(updatedTaskInfo.priority)}
      </h4>
    );
  }
  return (
    <div className="govuk-!-margin-top-2">
      <div>
        <select
          className="govuk-select"
          id="change-priority"
          name="changePriority"
          onChange={handlePriorityChange}
          value={updatedTaskInfo.priority}
        >
          <option value="50">Low</option>
          <option value="100">Medium</option>
          <option value="150">High</option>
        </select>
      </div>
      <button
        className="govuk-button govuk-!-margin-top-2"
        type="submit"
        onClick={submitPriorityChange}
      >
        Change priority
      </button>
    </div>
  );
};

ChangePriority.propTypes = {
  isEditingPriority: PropTypes.bool.isRequired,
  taskInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
  }).isRequired,
  taskUpdateSubmitted: PropTypes.bool.isRequired,
  setTaskUpdateSubmitted: PropTypes.func.isRequired,
};

export default ChangePriority;
