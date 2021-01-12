import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from 'react-navi';
import styled from 'styled-components';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import LogoBar from './LogoBar';
import { TeamContext } from '../../../utils/TeamContext';
import { mobileWidth } from '../../../utils/constants';
import useFetchBranchName from '../utils/useFetchBranchName';
import embedReport from '../utils/embedReport';

const PowerBIReport = () => {
  const navigation = useNavigation();
  const state = navigation.extractState();
  const reportContainer = useRef(null);
  const [branchName, setBranchName] = useState(null);
  const [embedReportArgs, setEmbedReportArgs] = useState(null);
  const [mobileLayout, setMobileLayout] = useState(null);
  const [report, setReport] = useState(null);
  const {
    team: { branchid: branchId },
  } = useContext(TeamContext);
  const visitedPages = useRef([]);
  const { trackPageView } = useMatomo();

  useEffect(() => {
    trackPageView();
  }, []);

  useEffect(() => {
    if (!state) {
      navigation.navigate('/reports');
    } else {
      setMobileLayout(window.innerWidth < mobileWidth);
      setEmbedReportArgs({
        mobileLayout,
        reportContainer,
        visitedPages,
        ...state,
      });
    }
  }, [mobileLayout, navigation, reportContainer, state, visitedPages]);

  useFetchBranchName({
    branchId,
    setBranchName,
  });

  useEffect(() => {
    setReport(embedReport({ branchName, ...embedReportArgs }));
  }, [branchName, embedReportArgs]);

  return (
    <ReportContainer
      {...{ mobileLayout }}
      style={{
        height: mobileLayout ? '50vh' : '50vw',
        maxHeight: mobileLayout ? null : '70vmin',
      }}
    >
      <Report id="report" ref={reportContainer} />
      {report && !mobileLayout ? <LogoBar {...{ report, branchName, visitedPages }} /> : null}
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
