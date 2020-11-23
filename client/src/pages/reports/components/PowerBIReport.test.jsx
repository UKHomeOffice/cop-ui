import React from 'react';
import { mount } from 'enzyme';
import 'jest-styled-components';
import { useNavigation } from 'react-navi';
import PowerBIReport, { setFullscreen, ReportContainer } from './PowerBIReport';
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

  it('runs fullscreen if there is a report', async () => {
    const fullScreenMock = jest.fn();
    setFullscreen({ fullscreen: fullScreenMock });
    expect(fullScreenMock).toHaveBeenCalledTimes(1);
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

  it('renders styles as expected', () => {
    const wrapper = mount(<ReportContainer mobileLayout />);
    expect(wrapper).toHaveStyleRule('height', '50vh');
  });

  it('matches snapshot', () => {
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper).toMatchSnapshot();
  });
});
