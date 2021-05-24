import React from 'react';
import { shallow, mount } from 'enzyme';
import { Link } from 'react-navi';
import TaskList from './TaskList';

describe('TaskList', () => {
  it('renders without crashing', () => {
    shallow(<TaskList groupBy="category" taskType="groups" />);
  });

  it('can click on a task', () => {
    const wrapper = mount(
      <TaskList
        tasks={[
          {
            id: '1',
            name: 'test',
            due: '19/03/2020',
            businessKey: 'test',
          },
        ]}
        groupBy="category"
        taskType="groups"
      />
    );

    expect(wrapper.find(Link).at(0).props().href).toBe('/tasks/1');
  });
});
