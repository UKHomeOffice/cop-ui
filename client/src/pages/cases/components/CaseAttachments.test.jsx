import React from 'react';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { shallow } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import CaseAttachments from './CaseAttachments';
import FileService from '../../../utils/FileService';

jest.mock('../../../utils/FileService');

describe('CaseAttachments', () => {
  const mockAxios = new MockAdapter(axios);
  const testBusinessKey = 'BUSINESS-KEY';
  const mockData = [];

  for (let i = 0; i < 3; i += 1) {
    mockData.push({
      submittedFilename: `test-file${i}.pdf`,
      submittedEmail: 'officer@homeoffice.gov.uk',
      submittedDateTime: '2020-01-27 12:21:23',
      url: `test-url${i}`,
    });
  }

  beforeEach(() => {
    FileService.mockClear();
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    mockAxios.reset();
  });

  afterAll(() => {
    FileService.mockClear();
  });

  it('should render without error', () => {
    shallow(<CaseAttachments businessKey={testBusinessKey} />);
  });

  it('should render loading if file service has not responded', async () => {
    mockAxios.onGet(`/files/files/${testBusinessKey}`).reply(200, []);

    render(<CaseAttachments businessKey={testBusinessKey} />);

    await waitFor(() => {
      expect(
        screen.queryByText('pages.cases.details-panel.case-attachments.loading-attachments')
      ).toBeInTheDocument();
    });
  });

  it('should render case attachments without error', async () => {
    mockAxios.onGet(`/files/files/${testBusinessKey}`).reply(200, mockData);

    await waitFor(() => render(<CaseAttachments businessKey={testBusinessKey} />));

    mockData.forEach((element) => {
      expect(screen.queryByText(element.submittedFilename)).toBeInTheDocument();
    });
  });

  it('should be able to download case attachment without error', async () => {
    mockAxios.onGet(`/files/files/${testBusinessKey}`).reply(200, mockData);

    await waitFor(() => render(<CaseAttachments businessKey={testBusinessKey} />));

    fireEvent.click(screen.getByText('test-file0.pdf'));

    /*
     * FileService.mock.instances.length - 1 refers to the most recent instance of the
     * FileService class - which is in this test at the time of the test executing
     */
    expect(
      FileService.mock.instances[FileService.mock.instances.length - 1].downloadFile
    ).toHaveBeenCalledWith({
      url: 'test-url0',
      originalName: 'test-file0.pdf',
    });
  });

  it('should handle no case attachments existing for case gracefully', async () => {
    mockAxios.onGet(`/files/files/${testBusinessKey}`).reply(500);

    await waitFor(() => render(<CaseAttachments businessKey={testBusinessKey} />));

    expect(
      screen.queryByText('pages.cases.details-panel.case-attachments.table.no-attachments')
    ).toBeInTheDocument();
  });
});
