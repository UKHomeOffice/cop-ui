import React from 'react';
import { mount } from 'enzyme';
import { useNavigation } from 'react-navi';
import PowerBIReport from './PowerBIReport';
import { mockNavigate } from '../../../setupTests';

describe('PowerBIReport Page', () => {
  it('renders without crashing', () => {
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper.exists()).toBe(true);
  });

  it('redirects if no state found', () => {
    mount(<PowerBIReport />);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('renders a report div', () => {
    useNavigation.mockImplementation(() => ({
      extractState: () => ({
        accessToken: 'xxx',
        embedUrl: 'http://www.example.com',
        id: 'abc',
        name: 'Power BI Report',
      }),
    }));
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper.find('#report').exists()).toEqual(true);
  });

  it('matches snapshot', () => {
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper).toMatchSnapshot();
  });
});
