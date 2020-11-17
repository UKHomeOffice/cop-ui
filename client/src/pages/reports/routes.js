import { map, mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from '../../routes/utils';
import ReportsListPage from './ReportsListPage';
import PowerBIReport from './components/PowerBIReport';

const routes = mount({
  '/': map((request, context) =>
    withAuthentication(
      route({
        title: context.t('pages.reports.list.title'),
        view: <ReportsListPage />,
      })
    )
  ),
  '/:reportName': map((request, context) =>
    withAuthentication(
      route({
        title: context.t('pages.report.title'),
        view: <PowerBIReport />,
      })
    )
  ),
});

export default routes;
