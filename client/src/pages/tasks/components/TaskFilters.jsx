import React from 'react';
import PropTypes from 'prop-types';

const TaskFilters = ({ search, handleFilters }) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            Sort by:
          </label>
          <select className="govuk-select" id="sort" name="sortBy" onChange={handleFilters}>
            <option value="asc-dueDate">Oldest due date</option>
            <option value="desc-dueDate">Latest due date</option>
            <option value="asc-created">Oldest created date</option>
            <option value="desc-created">Latest created date</option>
            <option value="asc-priority">Highest priority</option>
            <option value="desc-priority">Lowest priority</option>
          </select>
        </div>
      </div>
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="group">
            Group by:
          </label>
          <select className="govuk-select" id="group" name="groupBy" onChange={handleFilters}>
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
            value={search}
            onChange={handleFilters}
          />
        </div>
      </div>
    </div>
  );
};

TaskFilters.defaultProps = {
  search: '',
};

TaskFilters.propTypes = {
  handleFilters: PropTypes.func.isRequired,
  search: PropTypes.string,
};

export default TaskFilters;
