import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook } from '@testing-library/react-hooks';
import useFetchBranchName from './useFetchBranchName';

describe('useFetchBranchName', () => {
  const mockAxios = new MockAdapter(axios);
  const setBranchName = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches branch name as expected', async () => {
    mockAxios.onGet('/refdata/v2/entities/branch?filter=id=eq.23').reply(200, {
      data: [
        {
          name: 'Central',
        },
      ],
    });

    renderHook(() => useFetchBranchName({ branchId: 23, setBranchName }));
    /* TODO: See how to test that setBranchName has been called */
  });
});
