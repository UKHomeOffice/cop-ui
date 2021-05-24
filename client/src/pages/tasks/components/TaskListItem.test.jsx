import React from 'react';
import { mount, shallow } from 'enzyme';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Link } from 'react-navi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TaskListItem from './TaskListItem';
import { mockNavigate } from '../../../setupTests';

dayjs.extend(relativeTime);

describe('TaskListItem', () => {
  const mockAxios = new MockAdapter(axios);

  it('can render without error', () => {
    shallow(
      <TaskListItem
        id="1"
        due="2020/03/19"
        name="test"
        assignee="test"
        businessKey="test"
        taskType="groups"
      />
    );
  });

  it('can click on a task', () => {
    const wrapper = mount(
      <TaskListItem
        id="1"
        due="2020/03/19"
        name="test"
        assignee="test"
        businessKey="test"
        taskType="groups"
      />
    );

    expect(wrapper.find(Link).at(0).props().href).toBe('/tasks/1');
  });

  it('renders "Overdue" if task due date is in the past', () => {
    const wrapper = mount(
      <TaskListItem
        id="1"
        due="2020/03/19"
        name="test"
        assignee="test"
        businessKey="test"
        taskType="groups"
      />
    );
    const taskDue = wrapper
      .find('div[className="govuk-grid-column-one-third govuk-!-margin-bottom-3"]')
      .at(0);

    expect(taskDue.text()).toMatch(/Overdue/);
  });

  it('renders "Due" if task due date is in the future', () => {
    const tomorrow = dayjs().add(1, 'day').format();
    const wrapper = mount(
      <TaskListItem
        id="1"
        due={tomorrow}
        name="test"
        assignee="test"
        businessKey="test"
        taskType="groups"
      />
    );
    const taskDue = wrapper
      .find('div[className="govuk-grid-column-one-third govuk-!-margin-bottom-3"]')
      .at(0);

    expect(taskDue.text()).toMatch(/Due in a day/);
  });

  it('can claim a task not assigned to the current user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/1/assignee').reply(200, {
      count: 1,
    });
    // In the setupTests mocks, the default current user is "test"
    render(
      <TaskListItem
        id="1"
        due="2020/03/19"
        name="testName"
        assignee="testAssignee"
        taskType="groups"
        businessKey="testKey"
      />
    );

    expect(screen.getByText('Claim')).toBeTruthy();

    fireEvent.click(screen.getByText('Claim'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tasks/1');
    });
  });

  it('can unclaim a task assigned to the current user', async () => {
    mockAxios.onPost('/camunda/engine-rest/task/1/unclaim').reply(200, {
      count: 1,
    });
    // In the setupTests mocks, the default current user is "test"
    render(
      <TaskListItem
        id="1"
        due="2020/03/19"
        name="testName"
        assignee="test"
        businessKey="testKey"
        taskType="groups"
      />
    );

    expect(screen.getByText('Unclaim')).toBeTruthy();

    fireEvent.click(screen.getByText('Unclaim'));

    await waitFor(() => {
      expect(screen.queryByText('Unclaim')).toBeFalsy();
      expect(screen.getByText('Claim')).toBeTruthy();
    });
  });
});
