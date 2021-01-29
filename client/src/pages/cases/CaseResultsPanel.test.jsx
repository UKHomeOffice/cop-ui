import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import CaseResultsPanel from './CasesResultsPanel';
import CasePage from './CasePage';
import { AlertContextProvider } from '../../utils/AlertContext';
import AlertBanner from '../../components/alert/AlertBanner';

describe('CaseResultsPage', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('renders case results list and displays Case Details when selected ', async () => {
    mockAxios.onGet('/camunda/cases?query=keyword').reply(200, {
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

    mockAxios.onGet('/camunda/cases/businessKey1').reply(200, {
      businessKey: 'businessKey1',
      processInstances: [
        {
          definitionId: 'intel-referral:3:85c1a0aa-34bb-11eb-924e-e61a6d54c1b3',
          endDate: '2021-01-13T10:25:25.065+0000',
          formReferences: [{ name: 'intelligenceReferral', title: 'Intelligence Referral' }],
          id: 'e7e417c4-356b-11eb-b768-863d861ec96a',
          key: 'intel-referral',
          name: 'Submit Intelligence Referral',
          openTasks: [],
          startDate: '2020-12-03T13:31:53.319+0000',
        },
        {
          definitionId: 'enhance-intel:2:c2d7a5b0-27f7-11eb-b6c2-922e59dab112',
          endDate: '2021-01-13T10:25:24.993+0000',
          formReferences: [],
          id: 'e806bb0c-356b-11eb-b768-863d861ec96a',
          key: 'enhance-intel',
          name: 'Enhance intel',
          openTasks: [],
          startDate: '2020-12-03T13:31:53.546+0000',
        },
      ],
    });

    render(
      <CasePage>
        <CaseResultsPanel />
      </CasePage>
    );

    // Renders list of case search results on user input
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');

    fireEvent.change(input, { target: { value: 'keyword' } });

    await waitFor(() => {
      expect(screen.getByText('pages.cases.results-panel.title')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('businessKey1')).toBeTruthy();
    });

    // Renders Case Details Panel when user selects a case link
    const caseSelected = screen.getByText('businessKey1');
    fireEvent.click(caseSelected);

    // Displays message when loading case details
    expect(screen.getByText('Loading case details')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Submit Intelligence Referral')).toBeTruthy();
      expect(screen.getByText('Enhance intel')).toBeTruthy();
    });
  });

  it('loads more cases when multi page Case search results', async () => {
    // Set up mock data for two pages of search results
    const mockData = {
      page: {
        size: 20,
        totalElements: 40,
        totalPages: 2,
        number: 0,
      },
      _embedded: {
        cases: [],
      },
      _links: {
        next: { href: '/camunda/cases?query=multiPageResults&page=1&size=20' },
        last: { href: '/camunda/cases?query=multiPageResults&page=1&size=20' },
      },
    };
    for (let i = 1; i < 20; i += 1) {
      mockData._embedded.cases.push({ businessKey: `businessKey${i}`, processInstance: [] });
    }

    const mockDataPageTwo = {
      page: {
        size: 20,
        totalElements: 40,
        totalPages: 2,
        number: 1,
      },
      _embedded: {
        cases: [],
      },
      _links: {
        last: { href: '/camunda/cases?query=multiPageResults&page=1&size=20' },
      },
    };

    for (let i = 20; i <= 40; i += 1) {
      mockDataPageTwo._embedded.cases.push({ businessKey: `businessKey${i}`, processInstance: [] });
    }

    mockAxios.onGet('/camunda/cases?query=multiPageResults').reply(200, mockData);
    mockAxios
      .onGet('/camunda/cases?query=multiPageResults&page=1&size=20')
      .reply(200, mockDataPageTwo);

    render(
      <CasePage>
        <CaseResultsPanel />
      </CasePage>
    );

    // Renders first page of case search results when user inputs a query
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');
    fireEvent.change(input, { target: { value: 'multiPageResults' } });

    await waitFor(() => {
      expect(screen.getByText('pages.cases.results-panel.title')).toBeTruthy();
      expect(screen.getByText('40')).toBeTruthy();
      expect(screen.getByText('businessKey9')).toBeTruthy();
      expect(screen.getAllByText('Load more')).toBeTruthy();
    });

    // Load More button is visible
    const loadMoreButton = screen.getByText('Load more');
    fireEvent.click(loadMoreButton);

    // Loads more cases when 'Load more' is clicked
    await waitFor(() => {
      expect(screen.getByText('businessKey25')).toBeTruthy();
      expect(screen.getByText('40')).toBeTruthy();
      expect(screen.queryByText('Load more')).toBeNull();
    });
  });

  it('renders error message if Case Details API returns an error', async () => {
    mockAxios.onGet('/camunda/cases?query=keyword').reply(200, {
      page: {
        size: 20,
        totalElements: 3,
        totalPages: 1,
        number: 0,
      },
      _embedded: {
        cases: [{ businessKey: 'businessKey4', processInstance: [] }],
      },
      _links: {
        last: { href: 'url' },
      },
    });

    mockAxios.onGet('/camunda/cases/businessKey4').reply(500, null);

    render(
      <AlertContextProvider>
        <AlertBanner />
        <CasePage />
      </AlertContextProvider>
    );

    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');
    fireEvent.change(input, { target: { value: 'keyword' } });

    await waitFor(() => {
      expect(screen.getByText('businessKey4')).toBeTruthy();
    });
    const caseSelected = screen.getByText('businessKey4');
    fireEvent.click(caseSelected);

    await waitFor(() => {
      expect(screen.getByText('error.api.title')).toBeTruthy();
    });
  });
});
