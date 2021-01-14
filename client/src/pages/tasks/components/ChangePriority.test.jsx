import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ChangePriority from './ChangePriority';

describe('ChangePriority', () => {
  const mockAxios = new MockAdapter(axios);
  const mockSetTaskUpdateSubmitted = jest.fn();
  const mockProps = {
    isEditingPriority: true,
    taskInfo: {
      id: 'taskId',
      priority: 100,
      name: 'name',
      due: '2021-03-19T12:06:03.964+0000',
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

  it('can render without error', () => {
    render(<ChangePriority {...mockProps} />);
  });

  it('only displays the tasks priority when the priority is not being updated', () => {
    const props = { ...mockProps, isEditingPriority: false };

    render(<ChangePriority {...props} />);

    expect(screen.queryByText('Medium')).toBeInTheDocument();
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
    expect(screen.queryByText('High')).not.toBeInTheDocument();
    expect(screen.queryByText('Change priority')).not.toBeInTheDocument();
  });

  it('removes non-required props from request payload on submit', async () => {
    mockAxios.onPut('/camunda/engine-rest/task/taskId').reply(204);
    const props = {
      ...mockProps,
      taskInfo: {
        ...mockProps.taskInfo,
        foo: 'foo',
        bar: 'bar',
        hello: 'hello',
        world: 'world',
      },
    };

    render(<ChangePriority {...props} />);

    await waitFor(() => fireEvent.click(screen.getByText('Change priority')));

    const requestPayload = JSON.parse(mockAxios.history.put[0].data);

    expect(requestPayload.foo).toBeFalsy();
    expect(requestPayload.bar).toBeFalsy();
    expect(requestPayload.hello).toBeFalsy();
    expect(requestPayload.world).toBeFalsy();
    expect(requestPayload.priority).toBeTruthy();
  });
});
