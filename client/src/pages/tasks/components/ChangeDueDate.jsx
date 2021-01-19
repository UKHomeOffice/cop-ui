import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { isOverDue } from './utils';

const ChangeDueDate = ({ isEditingDueDate, taskInfo }) => {
  const due = dayjs(taskInfo.due);
  const [dueDate, setDueDate] = useState({
    day: due.$D,
    month: due.$M + 1,
    year: due.$y,
    hour: due.$H,
    minute: due.$m,
    second: due.$s,
  });

  const handleDueDateChange = (e) => {
    setDueDate({ ...dueDate, [e.target.name]: e.target.value });
  };

  if (!isEditingDueDate) {
    return <h4 className="govuk-heading-m govuk-!-font-size-19">{isOverDue(taskInfo.due)}</h4>;
  }
  return (
    <div className="govuk-form-group">
      <div className="govuk-date-input">
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor="day">
              Day
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              name="day"
              value={dueDate.day}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor="month">
              Month
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-2"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              name="month"
              value={dueDate.month}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor="year">
              Year
            </label>
            <input
              className="govuk-input govuk-date-input__input govuk-input--width-4"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              name="year"
              value={dueDate.year}
              onChange={handleDueDateChange}
            />
          </div>
        </div>
      </div>
      <button className="govuk-button govuk-!-margin-top-2" type="submit">
        Change due date
      </button>
    </div>
  );
};

ChangeDueDate.propTypes = {
  isEditingDueDate: PropTypes.bool.isRequired,
  taskInfo: PropTypes.shape({
    due: PropTypes.string.isRequired,
  }).isRequired,
};

export default ChangeDueDate;
