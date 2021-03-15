import React from 'react';
import { render, queryByAttribute, fireEvent } from '@testing-library/react';
import TaskFilters from './TaskFilters';

describe('TaskFilters', () => {
  const mockFiltersProp = {
    sortBy: 'test',
    groupBy: 'test',
    search: '',
  };
  const mockSetFilters = jest.fn();
  const mockSetPage = jest.fn();
  const getById = queryByAttribute.bind(null, 'id');

  const renderTaskFilters = () => {
    return render(
      <TaskFilters
        filters={{ ...mockFiltersProp }}
        setFilters={mockSetFilters}
        setPage={mockSetPage}
        taskType="groups"
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderTaskFilters();
  });

  it('calls handleFilter when sortBy option has been chosen', () => {
    const expectedResult = { ...mockFiltersProp, sortBy: 'desc-dueDate' };
    const { container } = renderTaskFilters();

    fireEvent.change(getById(container, 'sort'), { target: { value: 'desc-dueDate' } });

    expect(mockSetFilters).toHaveBeenCalledWith(expectedResult);
  });

  it('calls handleFilter when groupBy option has been chosen', () => {
    const expectedResult = { ...mockFiltersProp, groupBy: 'priority' };
    const { container } = renderTaskFilters();

    fireEvent.change(getById(container, 'group'), { target: { value: 'priority' } });

    expect(mockSetFilters).toHaveBeenCalledWith(expectedResult);
  });

  it('calls handleFilter when search bar has input', () => {
    const expectedResult = { ...mockFiltersProp, search: 'Border' };
    const { container } = renderTaskFilters();

    fireEvent.change(getById(container, 'filterTaskName'), { target: { value: 'Border' } });

    expect(mockSetFilters).toHaveBeenCalledWith(expectedResult);
  });
});
