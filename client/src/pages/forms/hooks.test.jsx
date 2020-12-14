import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { waitFor } from '@testing-library/react';
import { AlertContextProvider } from '../../utils/AlertContext';
import apiHooks from './hooks';
import { mockNavigate } from '../../setupTests';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
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
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(500, {});
    const handleOnFailure = jest.fn();
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
    const { result } = renderHook(() => apiHooks(), { wrapper });

    await act(async () => {
      result.current.submitForm(
        // data for 'submission' variable
        {
          data: {
            test: 'test',
            form: {
              submittedBy: 'test@digital.homeoffice.gov.uk',
            },
          },
        },
        // data for 'formInfo'
        {
          data: {
            name: 'test',
          },
        },
        // data for 'id'
        'formId',
        // for 'handleOnFailure'
        handleOnFailure
      );
    });
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, but failed get tasks', async () => {
    // eslint-disable-next-line react/prop-types
    const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
    const { result } = renderHook(() => apiHooks(), { wrapper });
    const handleOnFailure = jest.fn();

    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(500, {});

    // Successful submit
    await act(async () => {
      result.current.submitForm(
        {
          data: {
            test: 'test',
            form: {
              submittedBy: 'test@digital.homeoffice.gov.uk',
            },
          },
        },
        {
          data: {
            name: 'test',
          },
        },
        'formId',
        handleOnFailure
      );
    });
    // This will be the handleOnFailure for the onGet call
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, and go to the task if task exists for this user', async () => {
    const { result } = renderHook(() => apiHooks());

    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(200, [
        {
          id: 'testId',
          assignee: 'test', // this is declared in setupTests.js
        },
      ]);

    result.current.submitForm(
      // submission
      {
        data: {
          test: 'test',
          businessKey: 'testBusinessKey',
          form: {
            submittedBy: 'test@digital.homeoffice.gov.uk',
          },
        },
      },
      // formInfo
      {
        data: {
          name: 'test',
        },
      },
      // id
      'formId',
      () => {}
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks/testId');
    });
  });

  it('can handle successful submit, and go to dashboard with confirmation if no further task exists for this businessKey', async () => {
    const { result } = renderHook(() => apiHooks());

    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(200, []);

    result.current.submitForm(
      // submission
      {
        data: {
          test: 'test',
          businessKey: 'testBusinessKey',
          form: {
            submittedBy: 'test@digital.homeoffice.gov.uk',
          },
        },
      },
      // formInfo
      {
        data: {
          name: 'test',
        },
      },
      // id
      'formId',
      () => {}
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('can handle successful submit, and go to dashboard with confirmation if a task exists, but not for this user', async () => {
    const { result } = renderHook(() => apiHooks());

    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(200, [
        {
          id: 'testId',
          assignee: 'notThisUser',
        },
      ]);

    result.current.submitForm(
      // submission
      {
        data: {
          test: 'test',
          businessKey: 'testBusinessKey',
          form: {
            submittedBy: 'test@digital.homeoffice.gov.uk',
          },
        },
      },
      // formInfo
      {
        data: {
          name: 'test',
        },
      },
      // id
      'formId',
      () => {}
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
