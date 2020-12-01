import React from 'react';
import { render } from '@testing-library/react';
import TaskPaginationButton from './TaskPaginationButton';

describe('TaskPaginationButton', () => {
  const mockSetPage = jest.fn();
  it('can render without error', () => {
    render(
      <TaskPaginationButton
        isButtonDisabled={false}
        setPage={mockSetPage}
        newPageValue={20}
        text="test"
      />
    );
  });
});
