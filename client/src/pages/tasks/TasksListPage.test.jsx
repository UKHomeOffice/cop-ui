import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act, render, screen, waitFor, fireEvent, queryByAttribute } from '@testing-library/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TasksListPage from './TasksListPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import TaskList from './components/TaskList';

dayjs.extend(relativeTime);

describe('TasksListPage', () => {
  const mockAxios = new MockAdapter(axios);
  const getById = queryByAttribute.bind(null, 'id');
  let mockData;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
    mockData = [];
    for (let i = 0; i < 10; i += 1) {
      mockData.push({
        id: `id${Math.random() + Math.random()}`,
        name: 'test-name',
        processDefinitionId: 'processDefinitionId0',
        processInstanceId: 'processInstanceId0',
        due: dayjs().add(i, 'day').format(),
        created: dayjs().subtract(i, 'day').format(),
        assignee: 'john@doe.com',
        priority: 100,
      });
    }
  });

  it('renders without crashing', () => {
    shallow(<TasksListPage />);
  });

  it('renders application spinner when getting data', async () => {
    const wrapper = await mount(<TasksListPage />);

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true);
  });

  it('renders a list of tasks', async () => {
    mockAxios.onGet('/camunda/engine-rest/task').reply(200, [
      {
        id: 'id',
        name: 'name',
      },
    ]);
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 1,
    });
    const wrapper = await mount(<TasksListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(TaskList).exists()).toBe(true);
  });

  it('can click on load more', async () => {
    // This call is required in order to map a category to each task in mockData
    mockAxios.onGet('/camunda/engine-rest/process-definition').reply(200, [
      {
        category: 'test',
        id: 'processDefinitionId0',
      },
    ]);
    mockAxios.onPost('/camunda/engine-rest/task').reply(200, mockData);
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 100,
    });
    // This call is required in order to map a business key to each task in mockData
    mockAxios.onPost('/camunda/engine-rest/process-instance').reply(200, [
      {
        businessKey: 'TEST-BUSINESS-KEY',
        id: 'processDefinitionId0',
      },
    ]);
    const wrapper = await mount(<TasksListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('a[id="loadMore"]').exists()).toBe(true);

    await act(async () => {
      await wrapper
        .find('a[id="loadMore"]')
        .at(0)
        .simulate('click', {
          preventDefault: () => {},
        });

      await wrapper.update();
    });

    // Following assertions look to see how many axios calls are made in the course of the test. In this instance, 2 GET requests and 6 POST requests are expected
    expect(mockAxios.history.get.length).toBe(2);
    expect(mockAxios.history.post.length).toBe(6);
  });

  it('can group tasks correctly', async () => {
    // Add more objects with different processDefinitionIds to map different categories to them. Also added differing priorities to test priority grouping
    mockData = mockData.concat([
      {
        id: 'enhance-category',
        name: 'enhance-task',
        processDefinitionId: 'processDefinitionId1',
        processInstanceId: 'processInstanceId1',
        due: dayjs().format(),
        created: dayjs().format(),
        assignee: 'john@doe.com',
        priority: 50,
      },
      {
        id: 'enhance-category1',
        name: 'enhance-task',
        processDefinitionId: 'processDefinitionId1',
        processInstanceId: 'processInstanceId1',
        due: dayjs().format(),
        created: dayjs().format(),
        assignee: 'john@doe.com',
        priority: 150,
      },
    ]);
    // Provides the category to process definition id mapping
    mockAxios.onGet('/camunda/engine-rest/process-definition').reply(200, [
      {
        category: 'test',
        id: 'processDefinitionId0',
      },
      {
        category: 'enhance',
        id: 'processDefinitionId1',
      },
    ]);
    mockAxios.onPost('/camunda/engine-rest/task').reply(200, mockData);
    mockAxios.onPost('/camunda/engine-rest/task/count').reply(200, {
      count: 100,
    });
    // Provides the business key to process instance id mapping
    mockAxios.onPost('/camunda/engine-rest/process-instance').reply(200, [
      {
        businessKey: 'TEST-BUSINESS-KEY0',
        id: 'processInstanceId0',
      },
      {
        businessKey: 'TEST-BUSINESS-KEY1',
        id: 'processInstanceId1',
      },
    ]);
    const { container } = render(<TasksListPage />);

    await waitFor(() => {
      // Check if the grouping title has the correct number of tasks associated with it for categories, the number shown is correspondant with the number of tasks pulled from the api call. Categories is the default grouping when component has mounted
      expect(screen.getByText('10 test tasks')).toBeTruthy();
      expect(screen.getByText('2 enhance tasks')).toBeTruthy();
    });

    // Grab groupByDropdown after initial assertions, cannot define this before the await as the component has not mounted at that point
    const groupByDropDown = getById(container, 'group');

    fireEvent.change(groupByDropDown, { target: { value: 'priority' } });

    await waitFor(() => {
      // Same as category assertions but with priority
      expect(screen.getByText('1 Low task')).toBeTruthy();
      expect(screen.getByText('10 Medium tasks')).toBeTruthy();
      expect(screen.getByText('1 High task')).toBeTruthy();
    });

    fireEvent.change(groupByDropDown, { target: { value: 'assignee' } });

    await waitFor(() => {
      // Same as category assertions but with assignee, only one assertion here as all the tasks are assigned to john@doe.com
      expect(screen.getByText('12 john@doe.com tasks')).toBeTruthy();
    });

    fireEvent.change(groupByDropDown, { target: { value: 'businessKey' } });

    await waitFor(() => {
      expect(screen.getByText('10 TEST-BUSINESS-KEY0 tasks')).toBeTruthy();
      expect(screen.getByText('2 TEST-BUSINESS-KEY1 tasks')).toBeTruthy();
    });
  });
});
