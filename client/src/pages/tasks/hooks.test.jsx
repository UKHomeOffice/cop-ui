import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook, act } from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/react';
import apiHooks from './hooks';
import { mockNavigate } from '../../setupTests';
import { AlertContextProvider } from '../../utils/AlertContext';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

jest.mock('react', () => {
  const ActualReact = require.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({ setAlertContext: jest.fn(), setTeam: jest.fn(), setStaffId: jest.fn() }),
  };
});

describe('hooks', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockReset();
  });

  it('can handle a failure to submit a form', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(500, {});

    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
    const { result } = renderHook(() => apiHooks(), { wrapper });
    const submission = {
      data: {
        textField: 'test',
      },
    };
    const form = { name: 'formName', id: 'formId' };
    const taskId = 'taskId';
    const businessKey = 'businesskey';
    const handleOnFailure = jest.fn();

    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        taskId,
        businessKey,
        handleOnFailure,
      });
    });

    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, but failed get tasks', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businesskey')
      .reply(500, {});

    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
    const { result } = renderHook(() => apiHooks(), { wrapper });
    const submission = {
      data: {
        textField: 'test',
      },
    };
    const form = { name: 'formName', id: 'formId' };
    const taskId = 'taskId';
    const businessKey = 'businesskey';
    const handleOnFailure = jest.fn();

    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        taskId,
        businessKey,
        handleOnFailure,
      });
    });

    // This will be the handleOnFailure for the onGet call
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, and go to the task if task exists for this user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businesskey').reply(200, [
      {
        id: 'testId',
        assignee: 'test', // this is declared in setupTests.js
      },
    ]);
    const { result } = renderHook(() => apiHooks());
    const submission = {
      data: {
        textField: 'test',
      },
    };
    const form = { name: 'formName', id: 'formId' };
    const taskId = 'taskId';
    const businessKey = 'businesskey';

    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        taskId,
        businessKey,
        handleOnFailure: () => {},
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks/testId');
    });
  });

  it('can handle successful submit, and go to dashboard with confirmation if no further task exists for this businessKey', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businesskey')
      .reply(200, []);

    const { result } = renderHook(() => apiHooks());
    const submission = {
      data: {
        textField: 'test',
      },
    };
    const form = { name: 'formName', id: 'formId' };
    const taskId = 'taskId';
    const businessKey = 'businesskey';

    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        taskId,
        businessKey,
        handleOnFailure: () => {},
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('can handle successful submit, and go to dashboard with confirmation if a task exists, but not for this user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businesskey').reply(200, [
      {
        id: 'testId',
        assignee: 'notThisUser',
      },
    ]);

    const { result } = renderHook(() => apiHooks());
    const submission = {
      data: {
        textField: 'test',
      },
    };
    const form = { name: 'formName', id: 'formId' };
    const taskId = 'taskId';
    const businessKey = 'businesskey';

    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        taskId,
        businessKey,
        handleOnFailure: () => {},
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
