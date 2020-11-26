import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import TasksListPage from './TasksListPage';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import TaskList from './components/TaskList';

describe('TasksListPage', () => {
  const mockAxios = new MockAdapter(axios);
  let mockData;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
    mockData = [];
    for (let i = 0; i < 10; i += 1) {
      mockData.push({
        id: `id${Math.random() + Math.random()}`,
        name: `name${i}`,
        processDefinitionId: 'processDefinitionId0',
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
        processInstanceId: 'processDefinitionId0',
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
});
