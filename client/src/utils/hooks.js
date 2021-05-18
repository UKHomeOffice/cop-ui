import { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import _ from 'lodash';

import { useKeycloak } from '@react-keycloak/web';
import { useCurrentRoute } from 'react-navi';
import Logger from './logger';
import { AlertContext } from './AlertContext';
import { TeamContext } from './TeamContext';
import { StaffIdContext } from './StaffIdContext';
import { CurrentGroupContext } from './CurrentGroupContext';
import { GroupsContext } from './GroupsContext';

export const useAxios = () => {
  const [keycloak, initialized] = useKeycloak();
  const [axiosInstance, setAxiosInstance] = useState({});
  const { setAlertContext } = useContext(AlertContext);

  const routeRef = useRef(useCurrentRoute());
  const setAlertRef = useRef(setAlertContext);
  useEffect(() => {
    if (initialized) {
      const instance = axios.create({
        baseURL: '/',
        headers: {
          Authorization: initialized ? `Bearer ${keycloak.token}` : undefined,
        },
      });

      instance.interceptors.response.use(
        (response) => response,
        async (error) => {
          Logger.error({
            token: keycloak.token,
            message: error.response.data,
            path: routeRef.current.url.pathname,
          });

          setAlertRef.current({
            type: 'api-error',
            errors: [
              {
                status: error.response.status,
                message: error.message,
                path: error.response.config.url,
              },
            ],
          });

          return Promise.reject(error);
        }
      );

      setAxiosInstance({ instance });
    }
    return () => {
      setAxiosInstance({});
    };
  }, [initialized, keycloak.token]);

  return axiosInstance.instance;
};

export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export const useFetchTeam = () => {
  const [keycloak, initialized] = useKeycloak();
  const axiosInstance = useAxios();
  const { setTeam } = useContext(TeamContext);
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (initialized) {
      const {
        tokenParsed: { team_id: teamid },
      } = keycloak;
      const fetchData = async () => {
        try {
          if (teamid) {
            const response = await axiosInstance.get(
              `refdata/v2/entities/team?filter=id=eq.${teamid}`,
              {
                cancelToken: source.token,
              }
            );
            const team = response.data.data[0];
            // Coerces values of team object from numbers to strings to use in shift
            const reformattedTeam = _.mapValues(team, (elem) => {
              return typeof elem === 'number' ? String(elem) : elem;
            });
            setTeam(reformattedTeam);
          } else {
            // TODO: Redirect the user here because they have no teamid in KC...
          }
        } catch (error) {
          setTeam({});
        }
      };
      fetchData();
    }
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, initialized, keycloak, setTeam]);
};

export const useFetchCurrentGroup = () => {
  const [keycloak, initialized] = useKeycloak();
  const axiosInstance = useAxios();
  const { currentGroup, setCurrentGroup, setGroupLoaded } = useContext(CurrentGroupContext);
  useEffect(() => {
    if (currentGroup) {
      setGroupLoaded(true)
      return () => {} 
    }
    const source = axios.CancelToken.source();
    if (initialized && axiosInstance) {
      const {
        tokenParsed: { team_id: teamid },
      } = keycloak;
      const fetchData = async () => {
        try {
          if (teamid) {
            const response = await axiosInstance.get(
              `refdata/v2/entities/groups?filter=teamid=eq.${teamid}`,
              {
                cancelToken: source.token,
              }
            );
            setCurrentGroup(response.data.data[0])
          } 
        } catch (error) {
          setCurrentGroup(undefined);
        } finally {
          setGroupLoaded(true)
        }
      };
      fetchData();
    }
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, initialized])
};

export const useFetchGroups = () => {
  const [keycloak, initialized] = useKeycloak();
  const axiosInstance = useAxios();
  const { setGroups } = useContext(GroupsContext)
  useEffect(() => {
    if (initialized && axiosInstance) {
      const {
        tokenParsed: { team_id: teamid },
      } = keycloak;
      const allUserGroups = keycloak.tokenParsed.groups.join(',')
      const fetchData = async () => {
        try {
          if (teamid) {
            const response = await axiosInstance.get(
              `refdata/v2/entities/groups?mode=dataOnly&select=displayname,code,grouptypeid&filter=keycloakgrouppath=in.(${allUserGroups})`)
            setGroups(response.data.data)
          }
        }
        catch (error) {
          setGroups([]);
        }
      };
      fetchData();
    }
  }, [axiosInstance, initialized, keycloak, setGroups])
}

export const useFetchStaffId = () => {
  const [keycloak, initialized] = useKeycloak();
  const axiosInstance = useAxios();
  const { setStaffId } = useContext(StaffIdContext);
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (initialized) {
      const {
        tokenParsed: { email },
      } = keycloak;
      const fetchData = async () => {
        try {
          const response = await axiosInstance.get(`opdata/v2/staff?filter=email=eq.${email}`, {
            cancelToken: source.token,
          });
          const { staffid: staffId } = response.data[0];
          setStaffId(staffId);
        } catch (error) {
          setStaffId(null);
        }
      };
      fetchData();
    }
    return () => {
      source.cancel('Cancelling request');
    };
  }, [axiosInstance, initialized, keycloak, setStaffId]);
};

export default useIsMounted;
