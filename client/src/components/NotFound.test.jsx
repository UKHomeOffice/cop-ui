import React from 'react';
import { shallow } from 'enzyme';
import NotFound from './NotFound';

describe('Not Found page', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper.exists()).toBe(true);
  });
});
