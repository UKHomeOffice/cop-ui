import React from 'react';
import { shallow } from 'enzyme';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import CasePage from './CasePage';
import { AlertContextProvider } from '../../utils/AlertContext';
import AlertBanner from '../../components/alert/AlertBanner';

describe('CasePage', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('should render without crashing when there is a caseId prop', () => {
    shallow(<CasePage caseId="id" />);
  });

  it('should render without crashing when there is NO caseId prop', () => {
    shallow(<CasePage />);
  });

  it('should render results of case search when applicable', async () => {
    mockAxios.onGet('/camunda/cases?query=%22keyword%22').reply(200, {
      page: {
        size: 20,
        totalElements: 3,
        totalPages: 1,
        number: 0,
      },
      _embedded: {
        cases: [
          { businessKey: 'businessKey1', processInstance: [] },
          { businessKey: 'businessKey2', processInstance: [] },
          { businessKey: 'businessKey3', processInstance: [] },
        ],
      },
      _links: {
        last: { href: 'url' },
      },
    });
    render(<CasePage />);
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');

    fireEvent.change(input, { target: { value: 'keyword' } });

    await waitFor(() => {
      expect(screen.getByText('pages.cases.results-panel.title')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('businessKey1')).toBeTruthy();
      expect(screen.getByText('businessKey2')).toBeTruthy();
      expect(screen.getByText('businessKey3')).toBeTruthy();
    });
  });

  it('should gracefully render when no case search results', async () => {
    mockAxios.onGet('/camunda/cases?query=%22noResults%22').reply(200, {
      page: {
        size: 20,
        totalElements: 0,
        totalPages: 0,
        number: 0,
      },
      _links: {
        last: { href: 'url' },
      },
    });
    render(<CasePage />);
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');

    fireEvent.change(input, { target: { value: 'noResults' } });

    await waitFor(() => {
      expect(screen.getByText('pages.cases.results-panel.title')).toBeTruthy();
      expect(screen.getByText('0')).toBeTruthy();
    });
  });

  it('should render error message if case search returns an error', async () => {
    mockAxios.onGet('/camunda/cases?query=%22keywordError%22').reply(500, null);

    render(
      <AlertContextProvider>
        <AlertBanner />
        <CasePage />
      </AlertContextProvider>
    );

    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');

    fireEvent.change(input, { target: { value: 'keywordError' } });

    await waitFor(() => {
      expect(screen.getByText('error.api.title')).toBeTruthy();
    });
  });
});
