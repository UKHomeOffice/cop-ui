import React from 'react';
import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import CaseActions from './CaseActions';
import { casesResultsPanelData } from '../utils/CasesTestData.json';

describe('Case Metrics panel', () => {
  const getCaseDetailsMock = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render without error', () => {
    shallow(
      <CaseActions
        businessKey={casesResultsPanelData.businessKey}
        caseActions={casesResultsPanelData.actions}
        getCaseDetails={getCaseDetailsMock}
      />
    );
  });

  it('should render Case Actions tabs when actions exist', () => {
    render(
      <CaseActions
        businessKey={casesResultsPanelData.businessKey}
        caseActions={casesResultsPanelData.actions}
        getCaseDetails={getCaseDetailsMock}
      />
    );

    expect(screen.getByText('Record actions')).toBeTruthy();
    expect(screen.getByText('Record Assurance')).toBeTruthy();
  });

  it('should render message when no case actions exist', () => {
    render(
      <CaseActions
        businessKey={casesResultsPanelData.businessKey}
        caseActions={[]}
        getCaseDetails={getCaseDetailsMock}
      />
    );

    expect(screen.getByText('No actions available')).toBeTruthy();
  });
});
