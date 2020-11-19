import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigation } from 'react-navi';
import { factories, models, service } from 'powerbi-client';
import styled from 'styled-components';
import LogoBar from './LogoBar';
import { TeamContext } from '../../../utils/TeamContext';
import { useAxios, useIsMounted } from '../../../utils/hooks';

export const setFullscreen = (currentReport) => currentReport && currentReport.fullscreen();

const PowerBIReport = () => {
  const axiosInstance = useAxios();
  const report = useRef(null);
  const userBranchName = useRef(null);
  const reportContainer = useRef(null);
  const mobileLayout = window.innerWidth < 640;
  const navigation = useNavigation();
  const state = navigation.extractState();
  const logoBar = mobileLayout ? null : (
    <LogoBar
      setFullscreen={() => {
        setFullscreen(report.current);
      }}
    />
  );
  const isMounted = useIsMounted();
  const visitedPages = [];
  const {
    team: { branchid: branchId },
  } = useContext(TeamContext);
  const powerBIBranchNames = [
    'Central',
    'Detection Services',
    'Heathrow',
    'Intelligence',
    'National Operations',
    'North',
    'South',
    'South East and Europe',
  ];
  if (!state) navigation.navigate('/reports');

  useEffect(() => {
    const source = axios.CancelToken.source();
    const onPageChange = (e) => {
      let target;
      let visualNumber;
      const {
        newPage,
        newPage: { displayName },
      } = e.detail;

      if (visitedPages.includes(displayName)) return;

      visitedPages.push(displayName);
      if (displayName === 'Command Brief - OAR') {
        visualNumber = 5;
        target = { table: 'OAR', column: 'Branch Name' };
      } else if (displayName === 'Command Brief - IEN') {
        visualNumber = 4;
        target = { table: 'IEN', column: 'Branch' };
      } else {
        return;
      }

      newPage.getVisuals().then((visuals) => {
        const targetVisual = visuals[visualNumber];
        targetVisual
          .setSlicerState({
            filters: [
              {
                $schema: 'http://powerbi.com/product/schema#basic',
                target,
                operator: 'In',
                values: [userBranchName.current],
              },
            ],
          })
          .catch((errors) => {
            // eslint-disable-next-line no-console
            console.log('Errors loading visuals:', errors);
          });
      });
    };

    const embedReport = () => {
      const { accessToken, embedUrl, id } = state;
      const powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
      const embedConfig = {
        accessToken,
        type: 'report',
        embedUrl,
        id,
        permissions: models.Permissions.Read,
        settings: {
          filterPaneEnabled: false,
          layoutType: mobileLayout ? models.LayoutType.MobilePortrait : models.LayoutType.Master,
        },
        tokenType: models.TokenType.Embed,
      };
      report.current = powerbi.embed(reportContainer.current, embedConfig);
      if (userBranchName.current) {
        report.current.on('pageChanged', onPageChange);
      }
    };

    const fetchBranchName = async () => {
      if (axiosInstance) {
        try {
          const response = await axiosInstance.get(
            `/refdata/v2/entities/branch?filter=id=eq.${branchId}`,
            {
              cancelToken: source.token,
            }
          );
          if (isMounted.current) {
            const branchName = response.data.data.length && response.data.data[0].name;
            if (powerBIBranchNames.includes(branchName)) {
              userBranchName.current = branchName;
            }
            embedReport();
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Error fetching branch name:', e);
        }
      }
    };

    fetchBranchName();
    return undefined;
  }, [
    axiosInstance,
    branchId,
    isMounted,
    mobileLayout,
    powerBIBranchNames,
    state,
    userBranchName,
    visitedPages,
  ]);
  return (
    <ReportContainer
      {...{ mobileLayout }}
      style={{
        height: mobileLayout ? '50vh' : '50vw',
        maxHeight: mobileLayout ? null : '70vmin',
      }}
    >
      <Report id="report" ref={reportContainer} />
      {logoBar}
    </ReportContainer>
  );
};

export const ReportContainer = styled.div`
  height: ${(props) => (props.mobileLayout ? '50vh' : '50vw')};
  maxheight: ${(props) => (props.mobileLayout ? null : '70vmin')};
  position: relative;
`;

const Report = styled.div`
  width: 100%;
  height: 100%;
`;

export default PowerBIReport;
