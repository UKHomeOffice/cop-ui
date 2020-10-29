import { map, mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from '../../routes/utils';
import ReportsListPage from './ReportsListPage';

const routes = mount({
  '/': map((request, context) =>
    withAuthentication(
      route({
        title: context.t('pages.reports.list.title'),
        view: <ReportsListPage />,
      })
    )
  ),
});

export default routes;
