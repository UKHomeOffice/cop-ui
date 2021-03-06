import React from 'react';
import { shallow, mount } from 'enzyme';
import Layout from './index';
import Logger from '../../utils/logger';
import { mockNavigate } from '../../setupTests';

jest.mock('../../utils/logger', () => ({
  error: jest.fn(),
}));

describe('Layout', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('renders without crashing', () => {
    shallow(
      <Layout>
        <div>Hello</div>
      </Layout>
    );
  });

  it('can click reset', async () => {
    const ErrorComponent = () => {
      throw new Error('Failed');
    };

    const wrapper = await mount(
      <Layout>
        <ErrorComponent />
      </Layout>
    );
    expect(wrapper.find('.govuk-error-summary').length).toBe(1);
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalled();
    expect(Logger.error).toBeCalled();

    const alert = wrapper.find('.govuk-error-summary__body').at(0);
    alert.find('button').at(0).simulate('click');
  });

  it('can click on back button', () => {
    const wrapper = mount(<Layout />);
    wrapper.find('a[id="back-to-dashboard"]').simulate('click');
    expect(mockNavigate).toBeCalledWith('/');
  });
});
