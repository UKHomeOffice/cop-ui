import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import { useAxios, useFetchTeam, useIsMounted } from './hooks';
import Logger from './logger';
import { TeamContext } from './TeamContext';

jest.mock('./logger', () => ({
  error: jest.fn(),
}));

jest.mock('react', () => {
  const ActualReact = require.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({ setAlertContext: jest.fn(), setTeam: jest.fn() }),
  };
});

describe('axios hooks', () => {
  const mockAxios = new MockAdapter(axios);
  it('can perform a API call', async () => {
    mockAxios.onGet('/api/data').reply(200, [{ id: 'test' }]);
    const axiosInstance = renderHook(() => useAxios());

    const result = await axiosInstance.result.current.get('/api/data');
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(1);
  });

  it('can log error to server if api call fails', async () => {
    mockAxios.onGet('/api/data').reply(500, {});
    const axiosInstance = renderHook(() => useAxios());

    try {
      await axiosInstance.result.current.get('/api/data');
    } catch (e) {
      expect(Logger.error).toBeCalled();
    }
  });

  it('can mount', () => {
    const mounted = renderHook(() => useIsMounted());

    expect(mounted.result.current.current).toBe(true);

    mounted.unmount();

    expect(mounted.result.current.current).toBe(false);
  });

  it('can fetch team', async () => {
    mockAxios
      .onGet('/refdata/v2/entities/team?filter=id=eq.21')
      .reply(200, {
        data: [
          {
            branchid: 23,
          },
        ],
      });
    const { Provider } = TeamContext;
    const wrapper = ({ children }) => (
      <Provider value={{ team: { branchid: 23 } }}>{children}</Provider>
    );
    wrapper.propTypes = {
      children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    };
    renderHook(() => useFetchTeam(), { wrapper });
  });
});
