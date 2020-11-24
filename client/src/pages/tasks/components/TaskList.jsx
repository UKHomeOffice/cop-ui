import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';
import _ from 'lodash';
import TaskListItem from './TaskListItem';

const TaskList = ({ tasks }) => {
  const groupedByCategory = _.groupBy(tasks, (x) => x.category);
  return (
    <div>
      <ul className="app-task-list">
        {Object.keys(groupedByCategory).map((key) => {
          return (
            <div key={key} className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <hr
                  style={{
                    borderBottom: '3px solid #1d70b8',
                    borderTop: 'none',
                  }}
                />
                <h2 className="app-task-list__section">{`${groupedByCategory[key].length} ${key} tasks`}</h2>
                {groupedByCategory[key].map((task) => (
                  <TaskListItem
                    key={task.id}
                    id={task.id}
                    due={task.due}
                    name={task.name}
                    assignee={task.assignee}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

TaskList.defaultProps = {
  tasks: [],
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default TaskList;
