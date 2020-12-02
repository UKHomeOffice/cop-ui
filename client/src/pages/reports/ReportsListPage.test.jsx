import React from 'react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { act } from '@testing-library/react';
import ReportsListPage from './ReportsListPage';
import { mockNavigate } from '../../setupTests';

describe('ReportsListPage', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders without crashing', () => {
    shallow(<ReportsListPage />);
  });

  it('can render a list of reports', async () => {
    const mockReport = {
      accessToken: 'def',
      accessTokenExpiry: '2050-10-27T14:42:57Z',
      embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=123&groupId=456',
      id: 'abc',
      name: 'Test Report',
      reportType: 'PowerBIReport',
    };

    mockAxios.onGet('/reports/api/reports').reply(200, [mockReport]);

    const wrapper = mount(<ReportsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    expect(wrapper.find('h1').at(0).text()).toBe('pages.reports.list.heading');
    wrapper
      .find('.list-item a')
      .at(0)
      .simulate('click', {
        preventDefault: () => {},
      });

    const { accessTokenExpiry, reportType, ...state } = mockReport;
    expect(mockNavigate).toBeCalledWith('/reports/test-report', {
      state,
    });
  });

  it('can handle an exception in loading', async () => {
    mockAxios.onGet('/reports/api/reports').reply(500);

    const wrapper = mount(<ReportsListPage />);

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('h1').at(0).text()).toBe('pages.reports.list.heading');
  });
});
