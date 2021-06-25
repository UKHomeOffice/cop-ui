import React from 'react';
import { render, screen } from '@testing-library/react';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { Form } from 'react-formio';
import CaseAction from './CaseAction';
import { casesResultsPanelData } from '../utils/CasesTestData.json';
import recordActionsFormData from '../utils/RecordActionsFormData.json';
import { AlertContextProvider } from '../../../utils/AlertContext';
import AlertBanner from '../../../components/alert/AlertBanner';

describe('Case Action component', () => {
  let wrapper;
  const mockAxios = new MockAdapter(axios);
  const runAllPromises = () => new Promise(setImmediate);

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAxios.reset();
  });

  it('should render without error', () => {
    shallow(
      <CaseAction
        businessKey={casesResultsPanelData.businessKey}
        selectedAction={casesResultsPanelData.actions[0].process.formKey}
        selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
        selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
        getCaseDetails={jest.fn()}
      />
    );
  });

  it('should render form loading message', () => {
    render(
      <CaseAction
        businessKey={casesResultsPanelData.businessKey}
        selectedAction={casesResultsPanelData.actions[0].process.formKey}
        selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
        selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
        getCaseDetails={jest.fn()}
      />
    );

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should render form for case action', async () => {
    mockAxios.onGet('/form/name/performIntelActionMvp').reply(200, recordActionsFormData);

    wrapper = mount(
      <CaseAction
        businessKey={casesResultsPanelData.businessKey}
        selectedAction={casesResultsPanelData.actions[0].process.formKey}
        selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
        selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
        getCaseDetails={jest.fn()}
      />
    );

    await runAllPromises();
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(true);
  });

  it('should render error message if form request throws an error', async () => {
    mockAxios.onGet('/form/name/performIntelActionMvp').reply(500, {});

    wrapper = mount(
      <AlertContextProvider>
        <AlertBanner />
        <CaseAction
          businessKey={casesResultsPanelData.businessKey}
          selectedAction={casesResultsPanelData.actions[0].process.formKey}
          selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
          selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
          getCaseDetails={jest.fn()}
        />
      </AlertContextProvider>
    );

    await runAllPromises();
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(false);
    expect(wrapper.find('error.api.title')).toBeTruthy();
  });

  it('should render completion message when form is submitted', async () => {
    mockAxios.onGet('/form/name/performIntelActionMvp').reply(200, recordActionsFormData);

    mockAxios
      .onPost(
        `/camunda/engine-rest/process-definition/key/${casesResultsPanelData.actions[0].process['process-definition'].key}/submit-form`
      )
      .reply(200, {});

    wrapper = mount(
      <CaseAction
        businessKey={casesResultsPanelData.businessKey}
        selectedAction={casesResultsPanelData.actions[0].process.formKey}
        selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
        selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
        getCaseDetails={jest.fn()}
      />
    );

    await runAllPromises();
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(true);
    expect(wrapper.find('div[id="completion-message"]').exists()).toBe(false);

    const formComponent = wrapper.find(Form).at(0);
    const submissionData = {
      data: {
        form: {
          submittedBy: 'test1@digital.homeoffice.gov.uk',
          title: 'Perform Intel Action MVP',
        },
      },
    };

    formComponent.props().onSubmit(submissionData);
    await runAllPromises();
    wrapper.update();
    expect(wrapper.find('div[id="completion-message"]').exists()).toBe(true);
  });

  it('should render error message if submitting form throws error', async () => {
    mockAxios.onGet('/form/name/performIntelActionMvp').reply(200, recordActionsFormData);

    mockAxios
      .onPost(
        `/camunda/engine-rest/process-definition/key/${casesResultsPanelData.actions[0].process['process-definition'].key}/submit-form`
      )
      .reply(500, {});

    wrapper = mount(
      <AlertContextProvider>
        <AlertBanner />
        <CaseAction
          businessKey={casesResultsPanelData.businessKey}
          selectedAction={casesResultsPanelData.actions[0].process.formKey}
          selectedActionId={casesResultsPanelData.actions[0].process['process-definition'].key}
          selectedActionCompletionMessage={casesResultsPanelData.actions[0].completionMessage}
          getCaseDetails={jest.fn()}
        />
      </AlertContextProvider>
    );

    await runAllPromises();
    wrapper.update();
    expect(wrapper.find(Form).exists()).toBe(true);
    expect(wrapper.find('div[id="completion-message"]').exists()).toBe(false);

    const formComponent = wrapper.find(Form).at(0);
    const submissionData = {
      data: {
        form: {
          submittedBy: 'test1@digital.homeoffice.gov.uk',
          title: 'Perform Intel Action MVP',
        },
      },
    };

    formComponent.props().onSubmit(submissionData);
    await runAllPromises();
    wrapper.update();
    expect(wrapper.find('div[id="completion-message"]').exists()).toBe(false);
    expect(wrapper.find('.govuk-error-summary')).toHaveLength(1);
    expect(wrapper.find('error.api.title')).toBeTruthy();
  });
});
