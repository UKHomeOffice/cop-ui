import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import TaskPageSummary from './TaskPageSummary';

describe('TaskPageSummary', () => {
  const mockAxios = new MockAdapter(axios);
  const mockSetTaskUpdateSubmitted = jest.fn();
  const mockProps = {
    businessKey: 'businessKey',
    category: 'test',
    assignee: 'assignee',
    taskInfo: {
      id: 'id',
      priority: 100,
      name: 'name',
      due: '2021-03-19T12:06:03.964+0000',
      description: 'description',
    },
    taskUpdateSubmitted: false,
    setTaskUpdateSubmitted: mockSetTaskUpdateSubmitted,
  };

  beforeEach(() => {
    mockAxios.reset();
  });

  it('should render without error', () => {
    render(<TaskPageSummary {...mockProps} />);
  });

  it('should toggle priority editing', () => {
    render(<TaskPageSummary {...mockProps} />);

    // 2 'change' values on initial render, the second 'change' refers to the priority field
    fireEvent.click(screen.getAllByText('change')[1]);

    // Should only be one cancel on the screen as due date change has not been toggled
    expect(screen.queryByText('cancel')).toBeInTheDocument();
    expect(screen.queryByText('Change priority')).toBeInTheDocument();
    // We expect Low, Medium and High to exist here as this signifies the dropdown is rendered
    expect(screen.queryByText('Low')).toBeInTheDocument();
    expect(screen.queryByText('Medium')).toBeInTheDocument();
    expect(screen.queryByText('High')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));

    // We expect only Medium to exist here as this signifies the dropdown is not rendered
    expect(screen.getAllByText('change')[1]).toBeInTheDocument();
    expect(screen.queryByText('Change priority')).not.toBeInTheDocument();
    expect(screen.queryByText('Low')).not.toBeInTheDocument();
    expect(screen.queryByText('Medium')).toBeInTheDocument();
    expect(screen.queryByText('High')).not.toBeInTheDocument();
  });

  it('should toggle due date editing', () => {
    render(<TaskPageSummary {...mockProps} />);

    fireEvent.click(screen.getAllByText('change')[0]);

    expect(screen.queryByText('cancel')).toBeInTheDocument();
    expect(screen.queryByText('Change due date')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));

    expect(screen.getAllByText('change')[0]).toBeInTheDocument();
    expect(screen.queryByText('Change due date')).not.toBeInTheDocument();
    expect(screen.queryByText('Day')).not.toBeInTheDocument();
    expect(screen.queryByText('Month')).not.toBeInTheDocument();
    expect(screen.queryByText('Year')).not.toBeInTheDocument();
  });
});
