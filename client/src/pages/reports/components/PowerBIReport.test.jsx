import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import 'jest-styled-components';
import { useNavigation } from 'react-navi';
import PowerBIReport, { ReportContainer } from './PowerBIReport';
import { mockNavigate } from '../../../setupTests';
import { TeamContext } from '../../../utils/TeamContext';

describe('PowerBIReport Page', () => {
  const extractState = () => ({
    accessToken: 'xxx',
    embedUrl: 'http://www.example.com',
    id: 'abc',
    name: 'Power BI Report',
  });

  it('renders without crashing', () => {
    useNavigation.mockImplementationOnce(() => ({
      extractState,
    }));
    const wrapper = mount(<PowerBIReport />);
    expect(wrapper.exists()).toBe(true);
  });

  it('redirects if no state found', () => {
    mount(<PowerBIReport />);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('render report element when branchid is found', async () => {
    useNavigation.mockImplementationOnce(() => ({
      extractState,
    }));

    const { Provider } = TeamContext;
    const TestComponent = ({ children }) => (
      <Provider value={{ team: { branchid: 23 } }}>{children}</Provider>
    );

    TestComponent.propTypes = {
      children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    };

    const wrapper = mount(
      <TestComponent>
        <PowerBIReport />
      </TestComponent>
    );
    expect(wrapper.find('#report').exists()).toBe(true);
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
