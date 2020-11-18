import React from 'react';
import { mount } from 'enzyme';
import { redirect } from 'navi';
import { useNavigation } from 'react-navi';
import PowerBIReport from './PowerBIReport';

jest.mock('navi', () => ({
  redirect: jest.fn(),
}));

describe('PowerBIReport Page', () => {
  it('renders without crashing', () => {
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper.exists()).toBe(true);
  });

  it('redirects if no state found', () => {
    redirect.mockReset();
    mount(<PowerBIReport />);
    expect(redirect).toHaveBeenCalled();
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
