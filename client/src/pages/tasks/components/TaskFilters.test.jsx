import React from 'react';
import { shallow } from 'enzyme';
import TaskFilters from './TaskFilters';

describe('TaskFilters', () => {
  const mockHandleFilter = jest.fn();

  beforeEach(() => {
    mockHandleFilter.mockClear();
  });

  it('renders without crashing', () => {
    shallow(<TaskFilters search="" handleFilters={mockHandleFilter} />);
  });

  it('calls handleFilter when sortBy option has been chosen', () => {
    const wrapper = shallow(<TaskFilters search="" handleFilters={mockHandleFilter} />);
    const sortBy = wrapper.find('select[id="sort"]').at(0);

    sortBy.simulate('change', { event: { target: { value: 'desc-dueDate' } } });

    expect(mockHandleFilter).toHaveBeenCalled();
  });

  it('calls handleFilter when groupBy option has been chosen', () => {
    const wrapper = shallow(<TaskFilters search="" handleFilters={mockHandleFilter} />);
    const groupBy = wrapper.find('select[id="group"]').at(0);

    groupBy.simulate('change', { event: { target: { value: 'priority' } } });

    expect(mockHandleFilter).toHaveBeenCalled();
  });

  it('calls handleFilter when search bar has input', () => {
    const wrapper = shallow(<TaskFilters search="" handleFilters={mockHandleFilter} />);
    const searchBar = wrapper.find('input[id="filterTaskName"]').at(0);

    searchBar.simulate('change', { event: { target: { value: 'Border' } } });

    expect(mockHandleFilter).toHaveBeenCalled();
  });
});
