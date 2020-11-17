import React, { useEffect, useRef } from 'react';
import { redirect } from 'navi';
import { useNavigation } from 'react-navi';
import { factories, models, service } from 'powerbi-client';
import styled from 'styled-components/macro';

const PowerBIReport = () => {
  const reportContainer = useRef(null);
  const mobileLayout = window.innerWidth < 640;
  const state = useNavigation().extractState();

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
    powerbi.embed(reportContainer.current, embedConfig);
    return undefined;
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
    </ReportContainer>
  );
};

const ReportContainer = styled.div`
  height: ${(props) => (props.mobileLayout ? '50vh' : '50vw')};
  maxheight: ${(props) => (props.mobileLayout ? null : '70vmin')};
`;

const Report = styled.div`
  width: 100%;
  height: 100%;
`;

export default PowerBIReport;
