import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TaskPagination from './TaskPagination';

describe('TaskPagination', () => {
  const mockSetPage = jest.fn();

  it('can render without error', () => {
    render(<TaskPagination setPage={mockSetPage} page={0} maxResults={10} taskCount={100} />);
  });

  it('can disable pagination buttons', () => {
    const { rerender } = render(
      <TaskPagination setPage={mockSetPage} page={0} maxResults={10} taskCount={100} />
    );

    fireEvent.click(screen.getByText('« First'));

    expect(mockSetPage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('‹ Previous'));

    expect(mockSetPage).not.toHaveBeenCalled();

    rerender(<TaskPagination setPage={mockSetPage} page={90} maxResults={10} taskCount={100} />);

    fireEvent.click(screen.getByText('Next ›'));

    expect(mockSetPage).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Last »'));

    expect(mockSetPage).not.toHaveBeenCalled();
  });

  it('can click on pagination buttons successfully', () => {
    const { rerender } = render(
      <TaskPagination setPage={mockSetPage} page={0} maxResults={10} taskCount={100} />
    );

    fireEvent.click(screen.getByText('Next ›'));

    expect(mockSetPage).toHaveBeenCalled();

    fireEvent.click(screen.getByText('Last »'));

    expect(mockSetPage).toHaveBeenCalled();

    rerender(<TaskPagination setPage={mockSetPage} page={90} maxResults={10} taskCount={100} />);

    fireEvent.click(screen.getByText('« First'));

    expect(mockSetPage).toHaveBeenCalled();

    fireEvent.click(screen.getByText('‹ Previous'));

    expect(mockSetPage).toHaveBeenCalled();
  });
});
