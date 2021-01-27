import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import CasePage from '../CasePage';
import CaseResultsPanel from '../CasesResultsPanel';
import CaseDetailsPanel from '../CaseDetailsPanel';
import CaseHistory from './CaseHistory';

describe('Case History page', () => {
  const mockAxios = new MockAdapter(axios);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('shows Case History ', async () => {
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
    });

    mockAxios.onGet('/camunda/cases/businessKey1').reply(200, {
      businessKey: 'businessKey1',
      processInstances: [
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
        <CaseResultsPanel>
          <CaseDetailsPanel>
            <CaseHistory />
          </CaseDetailsPanel>
        </CaseResultsPanel>
      </CasePage>
    );
    const input = screen.getByPlaceholderText('pages.cases.search-placeholder');
    fireEvent.change(input, { target: { value: 'keyword' } });

    await waitFor(() => {
      expect(screen.getByText('businessKey1')).toBeTruthy();
    });

    const caseSelected = screen.getByText('businessKey1');
    fireEvent.click(caseSelected);

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
  });
});
