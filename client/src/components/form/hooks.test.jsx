import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AlertContextProvider } from '../../utils/AlertContext';
import apiHooks from './hooks';
import { mockNavigate } from '../../setupTests';
import { formSubmitPath, taskSubmitPath } from '../../utils/constants';

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

describe('hooks - can submit a form from a new form instance', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockReset();
  });

  // Common variables
  const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
  const { result } = renderHook(() => apiHooks(), { wrapper });
  const submission = {
    data: {
      textField: 'test',
      form: {
        submittedBy: 'test@digital.homeoffice.gov.uk',
      },
    },
  };
  const submissionWithSubmitAgain = {
    data: {
      textField: 'test',
      form: {
        submittedBy: 'test@digital.homeoffice.gov.uk',
      },
      submitAgain: true,
    },
  };
  const form = { name: 'test', id: 'formId', components: { find: () => false } };
  const id = 'formId';
  const businessKey = 'businessKey';
  const handleOnFailure = jest.fn();
  const handleOnRepeat = jest.fn();
  const submitPath = 'process-definition/key';

  // Scenarios
  it('can handle a failure to submit a form', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(500, {});
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, but failed get tasks', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(500, {});
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, and go to the task if task exists for this user', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey').reply(200, [
      {
        id: 'testId',
        assignee: 'test', // this is declared in setupTests.js
      },
    ]);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/testId');
  });

  it('can handle successful submit, and go to dashboard with confirmation if no further task exists for this businessKey', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey')
      .reply(200, []);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('can handle successful submit, and go to dashboard with confirmation if a task exists, but not for this user', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey').reply(200, [
      {
        id: 'testId',
        assignee: 'notUserWhoSubmittedForm',
      },
    ]);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('can handle successful submit, and call handleOnRepeat function when submitAgain is true', async () => {
    mockAxios
      .onPost('/camunda/engine-rest/process-definition/key/formId/submit-form')
      .reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey').reply(200, [
      {
        id: 'testId',
        assignee: 'notUserWhoSubmittedForm',
      },
    ]);
    await act(async () => {
      result.current.submitForm({
        submission: submissionWithSubmitAgain,
        form,
        id,
        businessKey,
        handleOnFailure,
        handleOnRepeat,
        submitPath,
      });
    });

    expect(handleOnRepeat).toHaveBeenCalledTimes(1);
  });
});

describe('hooks - can submit a form from a task', () => {
  const mockAxios = new MockAdapter(axios);
  beforeEach(() => {
    mockAxios.reset();
    mockNavigate.mockReset();
  });

  // Common variables
  const wrapper = ({ children }) => <AlertContextProvider>{children}</AlertContextProvider>;
  const { result } = renderHook(() => apiHooks(), { wrapper });
  const submission = {
    data: {
      textField: 'test',
      form: {
        submittedBy: 'test@digital.homeoffice.gov.uk',
      },
    },
  };
  const form = { name: 'test', id: 'formId', components: { find: () => false } };
  const id = 'taskId';
  const businessKey = 'businessKey';
  const handleOnFailure = jest.fn();
  const submitPath = 'task';

  // Scenarios
  it('can handle a failure to submit a form', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(500, {});
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        submitPath,
      });
    });
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, but failed get tasks', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=testBusinessKey')
      .reply(500, {});
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        submitPath,
      });
    });
    expect(handleOnFailure).toBeCalled();
  });

  it('can handle successful submit, and go to the next task if task exists for this user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey').reply(200, [
      {
        id: 'testId',
        assignee: 'test', // this is declared in setupTests.js
      },
    ]);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/testId');
  });

  it('can handle successful submit, and go to dashboard with confirmation if no further task exists for this businessKey', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios
      .onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey')
      .reply(200, []);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('can handle successful submit, and go to dashboard with confirmation if a task exists, but not for this user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});
    mockAxios.onGet('/camunda/engine-rest/task?processInstanceBusinessKey=businessKey').reply(200, [
      {
        id: 'testId',
        assignee: 'notUserWhoSubmittedForm',
      },
    ]);
    await act(async () => {
      result.current.submitForm({
        submission,
        form,
        id,
        businessKey,
        handleOnFailure,
        submitPath,
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('formName', () => {
    it('sets the correct form name when the submitVariableName field is present', () => {
      const formNameResult = result.current.formName({
        components: [{ key: 'submitVariableName', defaultValue: 'submitDeclarations' }],
        name: 'manDec',
      });
      expect(formNameResult).toEqual('submitDeclarations');
    });

    it('sets the correct form name when the submitVariableName field is not present', () => {
      const formNameResult = result.current.formName({
        components: [],
        name: 'manDec',
      });
      expect(formNameResult).toEqual('manDec');
    });
  });

  describe('businessKeyValue', () => {
    const testBusinessKey = 'COP-20200414-824';

    it('sets the business key value for forms', () => {
      const businessKeyResult = result.current.businessKeyValue(formSubmitPath, testBusinessKey);
      expect(businessKeyResult).toEqual(testBusinessKey);
    });

    it('sets an undefined business key value for tasks', () => {
      const businessKeyResult = result.current.businessKeyValue(taskSubmitPath, testBusinessKey);
      expect(businessKeyResult).toEqual(undefined);
    });
  });
});
