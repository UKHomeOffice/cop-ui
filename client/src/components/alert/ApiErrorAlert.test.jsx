import React from 'react';
import { shallow, mount } from 'enzyme';
import ApiErrorAlert from './ApiErrorAlert';
import NotFound from '../NotFound';
import Layout from '../layout';
import { mockHistoryListen } from '../../setupTests';

describe('ApiErrorAlert', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if no errors', () => {
    const wrapper = shallow(<ApiErrorAlert errors={[]} />);
    expect(wrapper.find('div').length).toBe(0);
  });

  it.each`
    status | message           | path
    ${409} | ${''}             | ${'/api/test'}
    ${401} | ${'unauthorized'} | ${'/api/test'}
    ${400} | ${'bad data'}     | ${'/api/test'}
    ${500} | ${'internal'}     | ${'/api/test'}
  `('error displayed for $status', async ({ status, message, path }) => {
    const wrapper = shallow(
      <ApiErrorAlert
        errors={[
          {
            status,
            message,
            path,
          },
        ]}
      />
    );
    expect(wrapper.find('.govuk-error-summary__title').exists()).toBe(true);
  });

  it('should render "Page not found"  if 404 is returned', () => {
    const wrapper = mount(
      <ApiErrorAlert
        errors={[
          {
            status: 404,
            message: 'Not found',
            path: '/api/test',
          },
        ]}
      />
    );

    expect(wrapper.find(NotFound).exists()).toBe(true);
  });

  it.each`
    status | message           | path
    ${409} | ${''}             | ${'/api/test'}
    ${404} | ${'not found'}    | ${'/api/test'}
    ${401} | ${'unauthorized'} | ${'/api/test'}
    ${400} | ${'bad data'}     | ${'/api/test'}
    ${500} | ${'internal'}     | ${'/api/test'}
  `('error removed for $status', async ({ status, message, path }) => {
    const wrapper = mount(
      <Layout>
        <ApiErrorAlert
          errors={[
            {
              status,
              message,
              path,
            },
          ]}
        />
      </Layout>
    );

    wrapper.find('a[id="home"]').simulate('click');

    expect(mockHistoryListen).toHaveBeenCalled();

    mockHistoryListen.mockClear();
  });
});
