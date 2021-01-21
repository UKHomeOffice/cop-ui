import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useAxios } from '../../../utils/hooks';
import { cleanSubmissionData, isOverDue, isDateValid } from './utils';

const ChangeDueDate = ({
  isEditingDueDate,
  taskInfo,
  taskUpdateSubmitted,
  setTaskUpdateSubmitted,
}) => {
  const { t } = useTranslation();
  const axiosInstance = useAxios();
  const due = dayjs(taskInfo.due);
  const [dueDate, setDueDate] = useState({
    day: due.$D,
    month: due.$M + 1,
    year: due.$y,
    hour: due.$H,
    minute: due.$m,
    second: due.$s,
    millisecond: due.$ms,
  });
  const [isError, setIsError] = useState(false);

  const handleDueDateChange = (e) => {
    setDueDate({ ...dueDate, [e.target.name]: e.target.value });
  };
  const handleDueDateSubmit = async (e) => {
    e.preventDefault();
    const { day, month, year, hour, minute, second, millisecond } = dueDate;
    const source = axios;
    const cleanedData = cleanSubmissionData(taskInfo);
    // Slice here to ensure the date is the correct format for date validation
    const updatedDueDate = `${year}-${`0${month}`.slice(-2)}-${`0${day}`.slice(-2)}`;

    if (isDateValid(updatedDueDate, 'YYYY-MM-DD')) {
      // Add time back on here as only date is changed in the UI, not the time
      cleanedData.due = dayjs(
        `${updatedDueDate}T${hour}:${minute}:${second}.${millisecond}`
      ).format('YYYY-MM-DDTHH:mm:ss.SSS[+0000]');

      await axiosInstance({
        method: 'PUT',
        url: `/camunda/engine-rest/task/${taskInfo.id}`,
        cancelToken: source.token,
        data: cleanedData,
      });
      setTaskUpdateSubmitted(!taskUpdateSubmitted);
    } else {
      setIsError(true);
    }
  };

  if (!isEditingDueDate) {
    return <h4 className="govuk-heading-m govuk-!-font-size-19">{isOverDue(taskInfo.due)}</h4>;
  }
  return (
    <div className={`govuk-form-group ${isError ? 'govuk-form-group--error' : null}`}>
      {isError && (
        <span className="govuk-error-message">
          <span className="govuk-visually-hidden">Error:</span>
          {t(`pages.task.submission.error.due-date-change`)}
        </span>
      )}
      <div className="govuk-date-input">
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor="day">
              Day
            </label>
            <input
              id="day"
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
              id="month"
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
              id="year"
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
      <button
        className="govuk-button govuk-!-margin-top-2"
        type="submit"
        onClick={handleDueDateSubmit}
      >
        Change due date
      </button>
    </div>
  );
};

ChangeDueDate.propTypes = {
  isEditingDueDate: PropTypes.bool.isRequired,
  taskInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    due: PropTypes.string.isRequired,
  }).isRequired,
  taskUpdateSubmitted: PropTypes.bool.isRequired,
  setTaskUpdateSubmitted: PropTypes.func.isRequired,
};

export default ChangeDueDate;
