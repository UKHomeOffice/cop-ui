import React from 'react';
import { shallow } from 'enzyme';
import LogoBar from './LogoBar';

describe('LogoBar', () => {
  const props = {
    setFullscreen: jest.fn(),
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('fires setFullscreen on button click', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    wrapper.find('button').simulate('click');
    expect(props.setFullscreen).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
