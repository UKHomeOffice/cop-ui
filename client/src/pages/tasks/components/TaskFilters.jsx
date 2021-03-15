import React from 'react';
import PropTypes from 'prop-types';
import SecureLocalStorageManager from '../../../utils/SecureLocalStorageManager';

const TaskFilters = ({ filters, setFilters, setPage, taskType }) => {
  const handleSortBy = (e) => {
    setFilters({ ...filters, sortBy: e.target.value });
    setPage(0);
    SecureLocalStorageManager.set(`${taskType}-tasksSortBy`, e.target.value);
  };
  const handleGroupBy = (e) => {
    setFilters({ ...filters, groupBy: e.target.value });
    SecureLocalStorageManager.set(`${taskType}-tasksGroupBy`, e.target.value);
  };
  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPage(0);
  };

  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            Sort by:
          </label>
          <select
            className="govuk-select"
            id="sort"
            name="sortBy"
            onChange={handleSortBy}
            value={filters.sortBy}
          >
            <option value="asc-dueDate">Oldest due date</option>
            <option value="desc-dueDate">Latest due date</option>
            <option value="asc-created">Oldest created date</option>
            <option value="desc-created">Latest created date</option>
            <option value="desc-priority">Highest priority</option>
            <option value="asc-priority">Lowest priority</option>
          </select>
        </div>
      </div>
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="group">
            Group by:
          </label>
          <select
            className="govuk-select"
            id="group"
            name="groupBy"
            onChange={handleGroupBy}
            value={filters.groupBy}
          >
            <option value="category">Category</option>
            <option value="businessKey">BF Reference</option>
            <option value="priority">Priority</option>
            <option value="assignee">Assignee</option>
          </select>
        </div>
      </div>
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="filterTaskName">
            Search by task name:
          </label>
          <input
            className="govuk-input govuk-!-width-full"
            id="filterTaskName"
            type="text"
            name="search"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

TaskFilters.defaultProps = {
  filters: {
    search: '',
  },
};

TaskFilters.propTypes = {
  filters: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    groupBy: PropTypes.string.isRequired,
    search: PropTypes.string,
  }),
  setFilters: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  taskType: PropTypes.string.isRequired,
};

export default TaskFilters;
