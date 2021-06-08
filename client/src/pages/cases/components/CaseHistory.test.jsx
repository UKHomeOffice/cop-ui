import React from 'react';
import { render, waitFor, screen, fireEvent, queryByAttribute } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import CasePage from '../CasePage';
import CaseResultsPanel from '../CasesResultsPanel';
import CaseDetailsPanel from '../CaseDetailsPanel';
import CaseHistory from './CaseHistory';
import { caseHistoryData } from '../utils/CasesTestData.json';

describe('Case History page', () => {
  const mockAxios = new MockAdapter(axios);
  const getById = queryByAttribute.bind(null, 'id');

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('should show Case History when a case is selected', async () => {
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

    mockAxios.onGet('/camunda/cases/businessKey1').reply(200, caseHistoryData.callOne);

    mockAxios.onGet('/camunda/cases/businessKey3').reply(200, caseHistoryData.callTwo);

    render(
      <CasePage>
        <CaseResultsPanel>
          <CaseDetailsPanel>
            <CaseHistory />
          </CaseDetailsPanel>
        </CaseResultsPanel>
      </CasePage>
    );
    // Search for a case by keyword
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');
    fireEvent.change(input, { target: { value: 'keyword' } });

    await waitFor(() => {
      expect(screen.getByText('businessKey1')).toBeTruthy();
    });
    // Select case with businesskey1
    const caseSelected = screen.getByText('businessKey1');
    fireEvent.click(caseSelected);

    // Correctly displays Case History in Case Details panel
    await waitFor(() => {
      expect(screen.getByText('Submit Intelligence Referral')).toBeTruthy();
      expect(screen.getAllByText('Status')).toHaveLength(2);
      expect(screen.getByText('1 completed')).toBeTruthy();
      expect(screen.getAllByText('13/01/2021 10:25')).toHaveLength(2);
      expect(screen.getByText('Enhance intel')).toBeTruthy();
      expect(screen.getByText('0 completed')).toBeTruthy();
      expect(screen.getByText('No forms available')).toBeTruthy();
      expect(screen.getByText('Intelligence Referral')).toBeTruthy();
      expect(screen.getByText('line-manager@digital.homeoffice.gov.uk')).toBeTruthy();
    });

    // Changes Case Details panel when new case is selected and displays history correctly
    const differentCase = screen.getByText('businessKey3');
    fireEvent.click(differentCase);

    await waitFor(() => {
      expect(screen.getByText('TEST 2 NAME 1')).toBeTruthy();
      expect(screen.getByText('TEST 2 NAME 2')).toBeTruthy();
    });
  });

  it('should render order of cases correctly', () => {
    const businessKey = 'businessKey-12345';

    const processInstances = [
      {
        definitionId: 'intel-referral:3:85c1a0aa-34bb-11eb-924e-e61a6d54c1b3',
        endDate: '2021-01-13T10:25:25.065+0000',
        formReferences: [
          {
            formVersionId: '032a4350-3799-4c5b-9cda-c05034be0b30',
            name: 'intelligenceReferral',
            submissionDate: '2021-01-04T20:34:14.356Z',
            submittedBy: 'line-manager@digital.homeoffice.gov.uk',
            title: 'Intelligence Referral',
          },
        ],
        id: 'key1',
        key: 'intel-referral',
        name: 'Submit Intelligence Referral',
        openTasks: [],
        startDate: '2020-12-03T13:32:54.546+0000',
      },
      {
        definitionId: 'enhance-intel:2:c2d7a5b0-27f7-11eb-b6c2-922e59dab112',
        endDate: '2021-01-13T10:25:24.993+0000',
        formReferences: [],
        id: 'key2',
        key: 'enhance-intel',
        name: 'Enhance intel',
        openTasks: [],
        startDate: '2020-12-04T13:31:53.546+0000',
      },
      {
        definitionId: 'enhance-intel:2:c2d7a5b0-27f7-11eb-b6c2-922e59dab112',
        endDate: '2021-01-13T10:25:24.993+0000',
        formReferences: [],
        id: 'key3',
        key: 'collect-event-at-border',
        name: 'Collect event at border',
        openTasks: [],
        startDate: '2020-12-03T13:31:53.546+0000',
      },
    ];

    const { container } = render(
      <CaseHistory businessKey={businessKey} processInstances={processInstances} />
    );

    const accordion = getById(container, 'caseSelected-businessKey-12345');

    const { childNodes } = accordion;

    expect(childNodes[1].textContent).toMatch(/^Enhance intel/);
    expect(childNodes[2].textContent).toMatch(/^Submit Intelligence Referral/);
    expect(childNodes[3].textContent).toMatch(/^Collect event/);

    // Find the "Order by" select field and change to "Earliest process start date" (i.e. ascending order)
    const control = screen.getByLabelText(
      'pages.cases.details-panel.case-history.select-input-order'
    );

    fireEvent.change(control, { target: { value: 'asc' } });

    expect(childNodes[1].textContent).toMatch(/^Collect event/);
    expect(childNodes[2].textContent).toMatch(/^Submit Intelligence Referral/);
    expect(childNodes[3].textContent).toMatch(/^Enhance intel/);
  });
});
