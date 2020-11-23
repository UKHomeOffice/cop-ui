import React from 'react';
import { shallow } from 'enzyme';
import TaskFilters from './TaskFilters';

describe('TaskFilters', () => {
  const mockHandleFilter = jest.fn();
  it('renders without crashing', () => {
    shallow(<TaskFilters search="test" handleFilters={mockHandleFilter} />);
  });
});
