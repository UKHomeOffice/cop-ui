import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import dayjs from 'dayjs';
import { act, screen, render, waitFor, fireEvent, queryByAttribute } from '@testing-library/react';
import TaskPage from './TaskPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import { AlertContextProvider } from '../../utils/AlertContext';
import DisplayForm from '../../components/form/DisplayForm';
import { mockNavigate } from '../../setupTests';

describe('TaskPage', () => {
  const mockAxios = new MockAdapter(axios);
  const getById = queryByAttribute.bind(null, 'id');

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<TaskPage taskId="id" />);
  });

  it('renders loading', async () => {
    const wrapper = mount(<TaskPage taskId="id" />);
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders task data', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      task: {
        id: 'taskId',
        name: 'task name',
        due: dayjs(),
        priority: '1000',
        assignee: null,
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });
    const wrapper = await mount(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    const taskName = wrapper.find('div[id="taskName"]').at(0);
    expect(taskName.exists()).toBe(true);
    expect(taskName.text()).toContain('BUSINESS KEY');
    expect(taskName.text()).toContain('task name');

    const taskPriority = wrapper.find('div[id="taskPriority"]').at(0);
    expect(taskPriority.find('h4').at(0).text()).toBe('High');

    const taskDue = wrapper.find('div[id="taskDueDate"]').at(0);
    expect(taskDue.find('h4').at(0).text()).not.toBe('');
    expect(global.window.document.title).toMatch('task name');
  });

  it('renders task data with variables', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      form: {
        name: 'testForm',
        display: 'form',
        components: [],
      },
      task: {
        id: 'taskId',
        name: 'task name',
        due: dayjs(),
        priority: '1000',
        assignee: 'test',
        variables: {
          taskVariableA: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          testEmail: {
            value: 'test',
            type: 'string',
          },
        },
      },
      variables: {
        email: {
          value: 'test',
          type: 'string',
        },
        test: {
          type: 'Json',
          value: JSON.stringify({ data: { text: 'test' } }),
        },
        'testForm::submissionData': {
          type: 'Json',
          value: JSON.stringify({
            data: {
              textField: 'submissionText',
              businessKey: 'businessKey',
              form: {
                submittedBy: 'test@digital.homeoffice.gov.uk',
              },
            },
          }),
        },
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });
    const wrapper = await mount(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    const taskName = wrapper.find('div[id="taskName"]').at(0);
    expect(taskName.exists()).toBe(true);
    expect(taskName.text()).toContain('BUSINESS KEY');
    expect(taskName.text()).toContain('task name');

    const taskPriority = wrapper.find('div[id="taskPriority"]').at(0);
    expect(taskPriority.find('h4').at(0).text()).toBe('High');

    const taskDue = wrapper.find('div[id="taskDueDate"]').at(0);
    expect(taskDue.find('h4').at(0).text()).not.toBe('');
  });

  it('displays the form when task assignee is equal to current user', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      form: {
        name: 'testForm',
        display: 'form',
        components: [],
      },
      task: {
        id: 'taskId',
        assignee: 'test', // this is declared in setupTests.js
        name: 'task name',
        due: dayjs(),
        priority: '1000',
        variables: {
          taskVariableA: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          testEmail: {
            value: 'test',
            type: 'string',
          },
        },
      },
      variables: {
        email: {
          value: 'test',
          type: 'string',
        },
        test: {
          type: 'Json',
          value: JSON.stringify({ data: { text: 'test' } }),
        },
        'testForm::submissionData': {
          type: 'Json',
          value: JSON.stringify({
            data: {
              textField: 'submissionText',
              businessKey: 'businessKey',
              form: {
                submittedBy: 'test@digital.homeoffice.gov.uk',
              },
            },
          }),
        },
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });

    const wrapper = await mount(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(DisplayForm).exists()).toBe(true);
  });

  it('does not display the form when task assignee is not equal to current user', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      form: {
        name: 'testForm',
        display: 'form',
        components: [],
      },
      task: {
        id: 'taskId',
        name: 'task name',
        due: dayjs(),
        priority: '1000',
        assignee: 'not-test',
        variables: {
          taskVariableA: {
            type: 'Json',
            value: JSON.stringify({ data: { text: 'test' } }),
          },
          testEmail: {
            value: 'test',
            type: 'string',
          },
        },
      },
      variables: {
        email: {
          value: 'test',
          type: 'string',
        },
        test: {
          type: 'Json',
          value: JSON.stringify({ data: { text: 'test' } }),
        },
        'testForm::submissionData': {
          type: 'Json',
          value: JSON.stringify({
            data: {
              textField: 'submissionText',
              businessKey: 'businessKey',
              form: {
                submittedBy: 'test@digital.homeoffice.gov.uk',
              },
            },
          }),
        },
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });
    const wrapper = await mount(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(DisplayForm).exists()).toBe(false);
  });

  it('can submit task', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      form: {
        name: 'testForm',
        display: 'form',
        components: [],
      },
      task: {
        id: 'taskId',
        assignee: 'test',
        name: 'task name',
        due: dayjs(),
        priority: '1000',
      },
      variables: {
        email: 'test',
        test: {
          type: 'Json',
          value: JSON.stringify({ data: { text: 'test' } }),
        },
        submissionData: {
          type: 'Json',
          value: JSON.stringify({
            data: {
              textField: 'submissionText',
              businessKey: 'businessKey',
              form: {
                submittedBy: 'test@digital.homeoffice.gov.uk',
              },
            },
          }),
        },
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });

    mockAxios.onPost('/camunda/engine-rest/task/taskId/submit-form').reply(200, {});

    const wrapper = await mount(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);

    const displayForm = wrapper.find(DisplayForm).at(0);
    expect(displayForm.exists()).toBe(true);

    await act(async () => {
      await displayForm.props().handleOnSubmit({
        data: {
          textField: 'test',
          businessKey: 'businessKey',
          form: {
            submittedBy: 'test@digital.homeoffice.gov.uk',
          },
        },
      });
      await wrapper.update();
    });
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);

    await act(async () => {
      await displayForm.props().handleOnCancel();
      await wrapper.update();
    });

    expect(mockNavigate).toBeCalledWith('/tasks');
  });

  it('should update task priority', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      task: {
        id: 'taskId',
        name: 'Cheese',
        due: dayjs(),
        priority: '100',
        assignee: null,
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });
    mockAxios.onPut('/camunda/engine-rest/task/taskId').reply(204);

    const { container } = render(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Change priority')).not.toBeInTheDocument();
      // There are 2 instances of change on first render, one for due date and one for priority
      expect(screen.queryAllByText('change')[1]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('change')[1]);

    expect(screen.queryByText('cancel')).toBeInTheDocument();
    expect(screen.queryByText('Change priority')).toBeInTheDocument();

    const dropDown = getById(container, 'change-priority');

    fireEvent.change(dropDown, { target: { value: '150' } });
    await waitFor(() => fireEvent.click(screen.getByText('Change priority')));

    // We expect 2 GET requests in the lifecycle of the test, one for the initial fetch and one to fetch the updated task
    expect(mockAxios.history.get.length).toBe(2);
    expect(mockAxios.history.put.length).toBe(1);
    expect(screen.queryByText('Change priority')).not.toBeInTheDocument();
    expect(screen.queryByText('cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Cheese')).toBeInTheDocument();
  });

  it('should update due date', async () => {
    mockAxios.onGet('/ui/tasks/taskId').reply(200, {
      task: {
        id: 'taskId',
        name: 'Cheese',
        due: dayjs().add(1, 'day').format('YYYY-MM-DDTHH:mm:ss.SSS[+0000]'),
        priority: '100',
        assignee: null,
      },
      processDefinition: {
        category: 'test',
      },
      processInstance: {
        businessKey: 'BUSINESS KEY',
      },
    });
    mockAxios.onPut('/camunda/engine-rest/task/taskId').reply(204);

    const { container } = render(
      <AlertContextProvider>
        <TaskPage taskId="taskId" />
      </AlertContextProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Change due date')).not.toBeInTheDocument();
      // There are 2 instances of change on first render, one for due date and one for priority
      expect(screen.queryAllByText('change')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('change')[0]);

    expect(screen.queryByText('cancel')).toBeInTheDocument();
    expect(screen.queryByText('Change due date')).toBeInTheDocument();

    fireEvent.change(getById(container, 'month'), { target: { value: '03' } });
    await waitFor(() => fireEvent.click(screen.getByText('Change due date')));

    expect(mockAxios.history.get.length).toBe(2);
    expect(mockAxios.history.put.length).toBe(1);
    expect(screen.queryByText('Change due date')).not.toBeInTheDocument();
    expect(screen.queryByText('cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Cheese')).toBeInTheDocument();
  });
});
