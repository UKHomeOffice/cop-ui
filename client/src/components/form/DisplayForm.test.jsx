import React from 'react';
import { mount } from 'enzyme';
import { Form } from 'react-formio';
import { act } from '@testing-library/react';
import FormErrorsAlert from '../alert/FormErrorsAlert';
import DisplayForm from './DisplayForm';

describe('FormPage', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
  });

  const formDetails = {
    formName: 'test',
    formDisplay: 'form',
    formId: 'id',
    formVersionId: 'version',
    formTitle: 'title',
    componentArray: [
      {
        id: 'eoduazt',
        key: 'textField1',
        case: '',
        mask: false,
        tags: '',
        type: 'textfield',
        input: true,
        label: 'Text Field',
        logic: [],
        hidden: false,
        prefix: '',
        suffix: '',
        unique: false,
        validate: {
          json: '',
          custom: '',
          unique: false,
          pattern: '',
          multiple: false,
          required: true,
          maxLength: '',
          minLength: '',
          customMessage: '',
          customPrivate: false,
          strictDateValidation: false,
        },
        widget: {
          type: 'input',
        },
      },
      {
        id: 'eoduazg',
        key: 'textField2',
        case: '',
        mask: false,
        tags: '',
        type: 'textfield',
        input: true,
        label: 'Text Field',
        logic: [],
        hidden: false,
        prefix: '',
        suffix: '',
        unique: false,
        validate: {
          json: '',
          custom: '',
          unique: false,
          pattern: '',
          multiple: false,
          required: true,
          maxLength: '',
          minLength: '',
          customMessage: '',
          customPrivate: false,
          strictDateValidation: false,
        },
        widget: {
          type: 'input',
        },
      },
      {
        id: 'e23op57',
        key: 'submit',
        size: 'md',
        type: 'button',
        block: false,
        input: true,
        label: 'Submit',
        theme: 'primary',
        action: 'submit',
        hidden: false,
        prefix: '',
        suffix: '',
        unique: false,
        widget: {
          type: 'input',
        },
      },
    ],
  };
  const errorDetails = [
    {
      component: {
        id: 'id',
        key: 'textField',
      },
      message: 'Textfield is required',
    },
  ];

  it('renders overlay when form is being submitted', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={formDetails}
        submitting
        handleOnCancel={jest.fn()}
        handleOnSubmit={jest.fn()}
      />
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    expect(wrapper.find('.Loader').at(0).exists()).toBe(true);
    expect(wrapper.find('.Loader__content').prop('style')).toHaveProperty('opacity', 1);
  });

  it('scrolls to the top on next', async () => {
    window.scrollTo = jest.fn();
    const wrapper = await mount(
      <DisplayForm
        form={formDetails}
        submitting
        handleOnCancel={jest.fn()}
        handleOnSubmit={jest.fn()}
      />
    );

    const form = wrapper.find(Form).at(0);

    form.props().onNextPage();
    expect(window.scrollTo).toBeCalledWith(0, 0);

    form.props().onPrevPage();
    expect(window.scrollTo).toBeCalledWith(0, 0);
  });

  it('renders error on form', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={formDetails}
        submitting
        handleOnCancel={jest.fn()}
        handleOnSubmit={jest.fn()}
      />
    );

    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const form = wrapper.find(Form).at(0);
    await form.instance().createPromise;

    form.instance().props.onError(errorDetails);
    await act(async () => {
      await wrapper.update();
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);
    expect(wrapper.find('.govuk-error-summary')).toHaveLength(1);
  });

  it('removes the error alert when you go to a previous page of the form', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={formDetails}
        submitting
        handleOnCancel={jest.fn()}
        handleOnSubmit={jest.fn()}
      />
    );
    await act(async () => {
      await Promise.resolve(wrapper);
      await new Promise((resolve) => setImmediate(resolve));
      await wrapper.update();
    });

    const form = wrapper.find(Form).at(0);
    await form.instance().createPromise;

    form.instance().props.onError(errorDetails);
    await act(async () => {
      await wrapper.update();
    });
    expect(wrapper.find('.govuk-error-summary')).toHaveLength(1);

    form.props().onPrevPage();
    await act(async () => {
      await wrapper.update();
    });
    expect(wrapper.find('.govuk-error-summary')).toHaveLength(0);
  });
});
