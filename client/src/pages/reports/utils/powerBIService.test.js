import { service } from 'powerbi-client';
import powerbi from './powerBIService';

describe('powerbi', () => {
  it('creates new Power BI service as expected', async () => {
    expect(powerbi).toBeInstanceOf(service.Service);
  });
});
