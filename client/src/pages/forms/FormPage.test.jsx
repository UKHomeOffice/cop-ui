import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow, mount } from 'enzyme';
import { act } from '@testing-library/react';
import { Form } from 'react-formio';
import { mockNavigate } from '../../setupTests';
import { testData } from '../../utils/TestData';
import ApplicationSpinner from '../../components/ApplicationSpinner';
import FormPage from './FormPage';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

const mockAxios = new MockAdapter(axios);

function mockFetchProcessName() {
  mockAxios.onGet(`/camunda/engine-rest/process-definition/key/id`).reply(200, {
    name: testData.formData.title,
  });
}

function mockFetchForm() {
  mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm').reply(200, {
    key: testData.formData.formKey,
  });
  mockAxios.onGet('/form/name/formKey').reply(200, {
    name: testData.formData.name,
    display: testData.formData.type,
    components: testData.formData.components,
  });
}

describe('FormPage', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
    wrapper = mount(<FormPage formId={testData.formData.id} />);
  });

  afterEach(() => {
    wrapper.unmount();
    jest.clearAllMocks();
  });

  it('Should render without crashing', () => {
    shallow(<FormPage formId={testData.formData.id} />);
  });

  it('Should show the application spinner when fetching form', () => {
    expect(wrapper.find(ApplicationSpinner).exists()).toBe(true); // default state is true
  });

  it('Should render the page with the forms page title', async () => {
    mockFetchProcessName();
    mockFetchForm();
    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find('h1.govuk-heading-l').exists()).toBeTruthy();
    expect(wrapper.find('h1.govuk-heading-l').text()).toEqual(testData.formData.title);
    expect(global.window.document.title).toMatch(testData.formData.title);
  });

  it('Should load and display the form', async () => {
    mockFetchProcessName();
    mockFetchForm();
    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(Form).exists()).toBe(true);
  });

  it('Should handle a failure to fetch process name', async () => {
    mockAxios.onGet(`/camunda/engine-rest/process-definition/key/id`).reply(500);
    mockFetchForm();

    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find('h1.govuk-heading-l').exists()).toBeTruthy();
    expect(wrapper.find('h1.govuk-heading-l').text()).toEqual('');
  });

  it('Should not load the form, and should not show application spinner if the call to get form data fails', async () => {
    mockFetchProcessName();
    mockAxios.onGet('/camunda/engine-rest/process-definition/key/id/startForm').reply(404);

    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find(ApplicationSpinner).exists()).toBe(false);
    expect(wrapper.find(Form).exists()).toBe(false);
    // src > components > alert > AlertBanner & ApiErrorAlert test that the alert banner is shown on a 404 error
  });

  it('Should navigate to dashboard on and only on cancel-form custom event', async () => {
    mockFetchProcessName();
    mockFetchForm();
    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    const form = wrapper.find('Form');
    form.props().onCustomEvent(new Event('cancel'));
    expect(mockNavigate).not.toBeCalled();
    form.props().onCustomEvent(new Event('cancel-form'));
    expect(mockNavigate).toBeCalledWith('/');
  });

  it('can click on back to forms button', async () => {
    mockFetchProcessName();
    mockFetchForm();
    wrapper = await mount(<FormPage formId={testData.formData.id} />);
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });
    wrapper.find('a[id="back-to-forms"]').simulate('click');
    expect(mockNavigate).toBeCalledWith('/forms');
  });
});
