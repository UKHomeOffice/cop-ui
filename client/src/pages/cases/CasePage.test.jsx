import React from 'react';
import { shallow } from 'enzyme';
import CasePage from './CasePage';

describe('CasePage', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders without crashing', () => {
    shallow(<CasePage caseId="id" />);
  });
});
