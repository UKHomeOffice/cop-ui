import React from 'react';
import PropTypes from 'prop-types';
import './TaskList.scss';
import _ from 'lodash';
import TaskListItem from './TaskListItem';
import { formatPriority } from '../utils';

const TaskList = ({ tasks, groupBy }) => {
  const tasksGroupedBy = _.groupBy(tasks, (x) => x[groupBy]);
  const isPriority = (keyName) => {
    if (groupBy === 'priority') {
      // Use parseInt as formatPriority takes a number as an argument
      return formatPriority(parseInt(keyName, 10));
    }
    return keyName;
  };

  return (
    <div>
      <ul className="app-task-list">
        {Object.keys(tasksGroupedBy).map((key) => {
          const numberOfTasks = tasksGroupedBy[key].length;
          return (
            <div key={key} className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <hr
                  style={{
                    borderBottom: '3px solid #1d70b8',
                    borderTop: 'none',
                  }}
                />
                <h2 className="app-task-list__section">{`${isPriority(key)} ${numberOfTasks} ${
                  numberOfTasks < 2 ? 'task' : 'tasks'
                }`}</h2>
                {tasksGroupedBy[key].map((task) => (
                  <TaskListItem
                    key={task.id}
                    id={task.id}
                    due={task.due}
                    name={task.name}
                    assignee={task.assignee}
                    businessKey={task.businessKey}
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
  groupBy: PropTypes.string.isRequired,
};

export default TaskList;
