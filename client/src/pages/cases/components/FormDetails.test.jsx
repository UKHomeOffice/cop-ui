import React from 'react';
import { render, screen, queryByAttribute } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { mount } from 'enzyme';
import { Form } from 'react-formio';
import FormDetails from './FormDetails';
import jsonFormFixture from '../utils/FormTestData.json';
import jsonSubmissionFixture from '../utils/SubmissionData.json';

const businessKey = 'businessKey-12345';
const formReferences = [
  {
    dataPath: 'businessKey-12345/detectionInventory/test-file-one.json',
    formVersionId: 'form-id-one',
    name: 'detectionInventory',
    submissionDate: '2021-01-07T14:44:32.053Z',
    submittedBy: 'test1@digital.homeoffice.gov.uk',
    title: 'Detection inventory',
  },
  {
    dataPath: 'businessKey-12345/recordBorderEvent/test-file-two.json',
    formVersionId: 'form-id-two',
    name: 'recordBorderEvent',
    submissionDate: '2021-02-05T16:31:42.224Z',
    submittedBy: 'test2@digital.homeoffice.gov.uk',
    title: 'Record border event',
  },
  {
    dataPath: 'businessKey-12345/intelReferral/test-file-three.json',
    formVersionId: 'form-id-three',
    name: 'intelReferral',
    submissionDate: '2021-02-05T16:41:42.224Z',
    submittedBy: 'test3@digital.homeoffice.gov.uk',
    title: 'Intelligence Referral',
  },
];

const mockAxios = new MockAdapter(axios);
const getById = queryByAttribute.bind(null, 'id');

const mockFetchForm = () => {
  mockAxios.onGet('/form/name/detectionInventory').reply(200, { jsonFormFixture });
};

const mockFetchSubmissionData = () => {
  mockAxios
    .onGet(
      '/camunda/cases/businessKey-12345/submission?key=businessKey-12345/detectionInventory/test-file-one.json'
    )
    .reply(200, {
      jsonSubmissionFixture,
    });
};

const runAllPromises = () => new Promise(setImmediate);

describe('Form details component', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('should render all form instances', () => {
    render(<FormDetails businessKey={businessKey} formReferences={formReferences} />);

    expect(screen.getByText('Detection inventory')).toBeTruthy();
    expect(screen.getByText('test1@digital.homeoffice.gov.uk')).toBeTruthy();
    expect(screen.getByText('test1@digital.homeoffice.gov.uk')).toBeTruthy();
    expect(screen.getByText('Record border event')).toBeTruthy();
    expect(screen.getByText('Intelligence Referral')).toBeTruthy();
    expect(screen.getByText('05/02/2021 16:31')).toBeTruthy();
  });

  it('should show forms in order of submission date with latest first', () => {
    const { container } = render(
      <FormDetails businessKey={businessKey} formReferences={formReferences} />
    );

    const firstFormDetailComponent = getById(container, 'form0');

    expect(firstFormDetailComponent.textContent).toMatch(/^Intelligence Referral/);
  });

  it('should only show Latest label on first form detail drop down', () => {
    const { container } = render(
      <FormDetails businessKey={businessKey} formReferences={formReferences} />
    );

    const firstFormDetailComponent = getById(container, 'form0');
    const secondFormDetailComponent = getById(container, 'form1');

    expect(firstFormDetailComponent.textContent).toMatch(/Latest/g);
    expect(secondFormDetailComponent.textContent).not.toMatch(/Latest/g);
  });

  it('should show a loading message and then the form snapshot when "Show details" is clicked', async () => {
    wrapper = mount(<FormDetails businessKey={businessKey} formReferences={formReferences} />);
    mockFetchForm();
    mockFetchSubmissionData();

    wrapper.find('button').first().simulate('click');
    expect(wrapper.find('h4.govuk-body').text()).toEqual(
      'pages.cases.details-panel.case-history.form-loading'
    );

    await runAllPromises();
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(true);
  });

  it('should hide form snapshot when "Hide details" is clicked', async () => {
    wrapper = mount(<FormDetails businessKey={businessKey} formReferences={formReferences} />);
    mockFetchForm();
    mockFetchSubmissionData();

    // Show form
    wrapper.find('button').first().simulate('click');
    await runAllPromises();
    wrapper.update();

    // Hide form
    wrapper.find('button').first().simulate('click');
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(false);
  });
});
