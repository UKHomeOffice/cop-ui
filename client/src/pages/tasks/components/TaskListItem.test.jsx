import React from 'react';
import { mount, shallow } from 'enzyme';
import { Link } from 'react-navi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import TaskListItem from './TaskListItem';

dayjs.extend(relativeTime);

describe('TaskListItem', () => {
  it('can render without error', () => {
    shallow(<TaskListItem id="1" due="19/03/2020" name="test" assignee="test" />);
  });

  it('can click on a task', () => {
    const wrapper = mount(
      <TaskListItem id="1" due="19/03/2020" name="test" assignee="test" />
    );

    expect(wrapper.find(Link).at(0).props().href).toBe('/tasks/1');
  });

  it('can render "Overdue" if task due date is in the past', () => {
    const wrapper = mount(
      <TaskListItem id="1" due="2020/03/19" name="test" assignee="test" />
    );

    const taskDue = wrapper
      .find('div[className="govuk-grid-column-one-third govuk-!-margin-bottom-3"]')
      .at(0);

    expect(taskDue.text()).toMatch(/Overdue/);
  });

  it('can render "Due" if task due date is in the future', () => {
    const tomorrow = dayjs().add(1, 'day').format();
    const wrapper = mount(<TaskListItem id="1" due={tomorrow} name="test" assignee="test" />);

    const taskDue = wrapper
      .find('div[className="govuk-grid-column-one-third govuk-!-margin-bottom-3"]')
      .at(0);

    expect(taskDue.text()).toMatch(/Due in a day/);
  });
});
