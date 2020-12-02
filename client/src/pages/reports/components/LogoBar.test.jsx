import React from 'react';
import { shallow } from 'enzyme';
import LogoBar from './LogoBar';

describe('LogoBar', () => {
  const props = {
    report: {
      fullscreen: jest.fn(),
      reload: jest.fn(),
    },
    visitedPages: {
      current: [],
    },
  };

  it('renders without crashing', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    expect(wrapper.exists()).toBe(true);
  });

  it('fires reload as expected', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    wrapper.find('#reload').simulate('click');
    expect(props.report.reload).toHaveBeenCalledTimes(1);
  });

  it('resets visitedPages as expected', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    wrapper.find('#reload').simulate('click');
    expect(props.visitedPages.current).toEqual([]);
  });

  it('fires fullscreen as expected', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    wrapper.find('#fullscreen').simulate('click');
    expect(props.report.fullscreen).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<LogoBar {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
