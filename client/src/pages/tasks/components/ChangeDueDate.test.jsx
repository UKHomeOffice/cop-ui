import React from 'react';
import { render, screen, fireEvent, waitFor, queryByAttribute } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import dayjs from 'dayjs';
import ChangeDueDate from './ChangeDueDate';

describe('ChangeDueDate', () => {
  const getById = queryByAttribute.bind(null, 'id');
  const mockAxios = new MockAdapter(axios);
  const mockSetTaskUpdateSubmitted = jest.fn();
  const mockProps = {
    isEditingDueDate: true,
    taskInfo: {
      id: 'taskId',
      priority: 100,
      name: 'name',
      due: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS[+0000]'),
      description: 'description',
      assignee: 'assignee',
      owner: 'owner',
      delegationState: 'delegationState',
      followUp: 'followUp',
      parentTaskId: 'parentTaskId',
      caseInstanceId: 'caseInstanceId',
      tenantId: 'tenantId',
    },
    taskUpdateSubmitted: false,
    setTaskUpdateSubmitted: mockSetTaskUpdateSubmitted,
  };

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render without error', () => {
    render(<ChangeDueDate {...mockProps} />);
  });

  it('should only display the tasks relative due date when the due date is not being updated', () => {
    // isEditingDueDate default set to true for testing, majority of tests are for when the date inputs ARE rendered
    const props = { ...mockProps, isEditingDueDate: false };

    render(<ChangeDueDate {...props} />);

    expect(screen.queryByText('Due in a day')).toBeInTheDocument();
    expect(screen.queryByText('Change due date')).not.toBeInTheDocument();
  });

  it('should handle date input change', () => {
    const { container } = render(<ChangeDueDate {...mockProps} />);

    fireEvent.change(getById(container, 'day'), { target: { value: '19' } });
    fireEvent.change(getById(container, 'month'), { target: { value: '03' } });
    fireEvent.change(getById(container, 'year'), { target: { value: '1995' } });

    expect(screen.queryByDisplayValue('19')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('03')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('1995')).toBeInTheDocument();
  });

  it('should submit due date change successfully', async () => {
    mockAxios.onPut('/camunda/engine-rest/task/taskId').reply(204);

    const { container } = render(<ChangeDueDate {...mockProps} />);

    fireEvent.change(getById(container, 'day'), { target: { value: '19' } });
    fireEvent.change(getById(container, 'month'), { target: { value: '03' } });
    fireEvent.change(getById(container, 'year'), { target: { value: '1995' } });
    await waitFor(() => fireEvent.click(screen.getByText('Change due date')));

    expect(mockAxios.history.put.length).toBe(1);
    expect(
      screen.queryByText('pages.task.submission.error.due-date-change')
    ).not.toBeInTheDocument();

    const requestPayload = JSON.parse(mockAxios.history.put[0].data);
    const expectedTz = requestPayload.due.split('T')[0];
    expect(expectedTz).toBe('1995-03-19');
  });

  it('should handle date input errors gracefully', async () => {
    mockAxios.onPut('/camunda/engine-rest/task/taskId').reply(204);

    const { container } = render(<ChangeDueDate {...mockProps} />);

    fireEvent.change(getById(container, 'day'), { target: { value: '100' } });
    await waitFor(() => fireEvent.click(screen.getByText('Change due date')));

    expect(screen.queryByText('pages.task.submission.error.due-date-change')).toBeInTheDocument();
    // We don't expect any call to be made
    expect(mockAxios.history.put.length).toBe(0);
  });
});
