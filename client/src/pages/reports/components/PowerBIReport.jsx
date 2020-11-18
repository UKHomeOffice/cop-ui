import React, { useEffect, useRef } from 'react';
import { redirect } from 'navi';
import { useNavigation } from 'react-navi';
import { factories, models, service } from 'powerbi-client';
import styled from 'styled-components/macro';
import LogoBar from './LogoBar';

const PowerBIReport = () => {
  const report = useRef(null);
  const reportContainer = useRef(null);
  const mobileLayout = window.innerWidth < 640;
  const state = useNavigation().extractState();
  const setFullscreen = () => report.current && report.current.fullscreen();
  const logoBar = mobileLayout ? null : <LogoBar setFullscreen={setFullscreen} />;

  useEffect(() => {
    if (!state) return redirect('/reports/');
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
    if (reportContainer.current) {
      report.current = powerbi.embed(reportContainer.current, embedConfig);
    }
    return () => {
      reportContainer.current = null;
    };
  }, [mobileLayout, state]);

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

const ReportContainer = styled.div`
  height: ${(props) => (props.mobileLayout ? '50vh' : '50vw')};
  maxheight: ${(props) => (props.mobileLayout ? null : '70vmin')};
  position: relative;
`;

const Report = styled.div`
  width: 100%;
  height: 100%;
`;

export default PowerBIReport;
