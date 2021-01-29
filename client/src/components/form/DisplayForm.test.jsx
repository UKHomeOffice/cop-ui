import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';
import { Form } from 'react-formio';
import { testData } from '../../utils/TestData';
import FormErrorsAlert from '../alert/FormErrorsAlert';
import DisplayForm from './DisplayForm';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

window.scrollTo = jest.fn();

describe('FormPage', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    // eslint-disable-next-line no-console
    console.warn = jest.fn();
  });

  it('Should show a spinner (Loader) when form is being submitted', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={testData.formData}
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

  it('Should automatically scroll to the top on next/previous button clicks', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={testData.formData}
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

  it('Should display an error alert box at the top of the form when there are errors', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={testData.formData}
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

    form.instance().props.onError(testData.formErrors);
    await act(async () => {
      await wrapper.update();
    });

    expect(wrapper.find(FormErrorsAlert).exists()).toBe(true);
    expect(wrapper.find('.govuk-error-summary')).toHaveLength(1);
  });

  it('removes the error alert when you go to a previous page of the form', async () => {
    const wrapper = await mount(
      <DisplayForm
        form={testData.formData}
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

    form.instance().props.onError(testData.formErrors);
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
