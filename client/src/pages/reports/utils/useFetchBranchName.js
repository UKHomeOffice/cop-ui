import { useEffect } from 'react';
import axios from 'axios';
import { useAxios, useIsMounted } from '../../../utils/hooks';

const useFetchBranchName = async ({ branchId, setBranchName }) => {
  const axiosInstance = useAxios();
  const isMounted = useIsMounted();
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (axiosInstance && branchId) {
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(
            `/refdata/v2/entities/branch?filter=id=eq.${branchId}`,
            {
              cancelToken: source.token,
            }
          );
          if (isMounted.current) {
            const branchName = response.data.data.length && response.data.data[0].name;
            setBranchName(branchName);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Error fetching branch name:', e);
        }
      };
      fetchData();
    }
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, branchId, isMounted, setBranchName]);
};

export default useFetchBranchName;
