import React from 'react';
import PropTypes from 'prop-types';
import TaskPaginationButton from './TaskPaginationButton';

const TaskPagination = ({ setPage, page, maxResults, taskCount }) => {
  return (
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-quarter">
        <TaskPaginationButton
          isButtonDisabled={page - maxResults < 0}
          setPage={setPage}
          newPageValue={0}
          text="&laquo; First"
        />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <TaskPaginationButton
          isButtonDisabled={page - maxResults < 0}
          setPage={setPage}
          newPageValue={page - maxResults}
          text="&lsaquo; Previous"
        />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <TaskPaginationButton
          isButtonDisabled={page + maxResults >= taskCount}
          setPage={setPage}
          newPageValue={page + maxResults}
          text="Next &rsaquo;"
        />
      </div>
      <div className="govuk-grid-column-one-quarter">
        <TaskPaginationButton
          isButtonDisabled={page + maxResults >= taskCount}
          setPage={setPage}
          newPageValue={Math.floor(taskCount / maxResults) * maxResults}
          text="Last &raquo;"
        />
      </div>
    </div>
  );
};

TaskPagination.propTypes = {
  setPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  maxResults: PropTypes.number.isRequired,
  taskCount: PropTypes.number.isRequired,
};

export default TaskPagination;
