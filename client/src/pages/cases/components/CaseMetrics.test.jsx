import React from 'react';
import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import CaseMetrics from './CaseMetrics';

const testBusinessKey = 'businessKey-12345';

const testCaseMetrics = {
  averageTimeToCompleteProcessInSeconds: 169985,
  noOfCompletedProcessInstances: 2,
  noOfCompletedUserTasks: 1,
  noOfOpenUserTasks: 0,
  noOfRunningProcessInstances: 0,
  overallTimeInSeconds: 339970,
};

describe('Case Metrics panel', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render without error', () => {
    shallow(<CaseMetrics businessKey={testBusinessKey} caseMetrics={testCaseMetrics} />);
  });

  it('should render summary and case metrics correctly', () => {
    render(<CaseMetrics businessKey={testBusinessKey} caseMetrics={testCaseMetrics} />);

    expect(
      screen.getByText('pages.cases.details-panel.case-metrics.summary businessKey-12345')
    ).toBeTruthy();
    expect(screen.getAllByText('0')).toHaveLength(2);
    expect(screen.getByText('Open processes')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('Completed processes')).toBeTruthy();
    expect(screen.getByText('4 days')).toBeTruthy();
    expect(screen.getByText('Total time')).toBeTruthy();
    expect(screen.getByText('2 days')).toBeTruthy();
    expect(screen.getByText('Average process completion')).toBeTruthy();
  });
});
