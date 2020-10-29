import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import _ from 'lodash';
import ReportsListPage from './ReportsListPage';
import { mockNavigate } from '../../setupTests';
import config from 'react-global-configuration';

describe('ReportsListPage', () => {
  const mockAxios = new MockAdapter(axios);
  config.set({ reportsServiceUrl: 'http://example.com/reports' });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<ReportsListPage />);
  });

  it('can render a list of reports', async () => {
    mockAxios.onGet('http://example.com/reports').reply(200, [
      {
        id: 'abc',
        name: 'Test Report',
        reportType: 'PowerBIReport',
        embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=123&groupId=456',
        accessToken: 'def',
        accessTokenExpiry: '2050-10-27T14:42:57Z',
      },
    ]);

    const wrapper = mount(<ReportsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find('h1').at(0).text()).toBe('pages.reports.list.heading');

    wrapper
      .find('a')
      .at(0)
      .simulate('click', {
        preventDefault: () => {},
      });

    expect(mockNavigate).toBeCalledWith('/reports/test-report');
  });

  it('can handle an exception in loading', async () => {
    mockAxios.onGet('http://example.com/reports').reply(500);

    const wrapper = mount(<ReportsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('h1').at(0).text()).toBe('pages.reports.list.heading');
  });
});
