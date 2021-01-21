import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const cleanSubmissionData = (submissionData) => {
  const propsToKeep = [
    'name',
    'description',
    'priority',
    'assignee',
    'owner',
    'delegationState',
    'due',
    'followUp',
    'parentTaskId',
    'caseInstanceId',
    'tenantId',
  ];
  const result = {};

  propsToKeep.forEach((key) => {
    result[key] = submissionData[key];
  });
  return result;
};

export const isOverDue = (due) => {
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

export const isDateValid = (date, format) => dayjs(date).format(format) === date;
