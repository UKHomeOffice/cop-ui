import { map, mount, route } from 'navi';
import React from 'react';
import { withAuthentication } from '../../routes/utils';
import CasePage from './CasePage';

const routes = mount({
  '/': map((request, context) =>
    withAuthentication(
      route({
        title: context.t('pages.cases.title'),
        view: <CasePage />,
      })
    )
  ),
  '/:caseId': map((request, context) =>
    withAuthentication(
      route({
        title: context.t('pages.cases.title'),
        view: <CasePage caseId={request.params.caseId} />,
      })
    )
  ),
});

export default routes;
