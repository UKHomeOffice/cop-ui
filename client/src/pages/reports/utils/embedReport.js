import { models } from 'powerbi-client';
import { powerBIBranchNames } from '../../../utils/constants';
import onPageChange from './onPageChange';
import powerbi from './powerBIService';

const embedReport = ({
  accessToken,
  branchName,
  embedUrl,
  id,
  mobileLayout,
  reportContainer,
  visitedPages,
}) => {
  let report;
  if (reportContainer) {
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

    powerbi.reset(reportContainer.current);
    report = powerbi.embed(reportContainer.current, embedConfig);
    if (powerBIBranchNames.includes(branchName)) {
      report.on('pageChanged', (event) => onPageChange(branchName, event, visitedPages));
    }
  }
  return report;
};

export default embedReport;
