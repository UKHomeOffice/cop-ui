import React from 'react';
import PropTypes from 'prop-types';

const TaskFilters = ({ search, handleFilters }) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="sort">
            Sort by
            <select className="govuk-select" id="sort" name="sort" onChange={handleFilters}>
              <option value="oldest-due-date">Oldest due date</option>
              <option value="latest-due-date">Latest due date</option>
              <option value="oldest-created-date">Oldest created date</option>
              <option value="latest-created-date">Latest created date</option>
              <option value="highest-priority">Highest priority</option>
              <option value="lowest-priority">Lowest priority</option>
            </select>
          </label>
        </div>
      </div>
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="group">
            Group by
            <select className="govuk-select" id="group" name="groupBy" onChange={handleFilters}>
              <option value="category">Category</option>
              <option value="bf-reference">BF Reference</option>
              <option value="priority">Priority</option>
              <option value="assignee">Assignee</option>
            </select>
          </label>
        </div>
      </div>
      <div className="govuk-grid-column-one-third">
        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="filterTaskName">
            Search by task name:
            <input
              className="govuk-input govuk-!-width-full"
              id="filterTaskName"
              type="text"
              name="search"
              value={search}
              onChange={handleFilters}
            />
          </label>
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
