import { factories, service } from 'powerbi-client';

const powerbi = new service.Service(
  factories.hpmFactory,
  factories.wpmpFactory,
  factories.routerFactory
);

export default powerbi;
