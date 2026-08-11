import { type TemplateSrv } from '@grafana/runtime';

import { getMockDSInstanceSettings, mockBackendService } from '../mocks/datasource';
import { mockInfluxSQLVariableFetchResponse } from '../mocks/response';

import { FlightSQLDatasource } from './datasource.flightsql';

mockInfluxSQLVariableFetchResponse.data.results.metricFindQuery.frames[0].data.values[0].push('sensor.light');
mockBackendService(mockInfluxSQLVariableFetchResponse);
describe('flightsql datasource', () => {
  const templateSrv: TemplateSrv = {
    containsTemplate: jest.fn(),
    replace: jest.fn().mockImplementation((val: string) => val),
    updateTimeRange: jest.fn(),
    getVariables: jest.fn().mockReturnValue([
      {
        name: 'templateVar',
        text: 'templateVar',
        value: 'templateVar',
        type: '',
        label: 'templateVar',
      },
    ]),
  };
  const mockInstanceSettings = getMockDSInstanceSettings();
  const instanceSettings = {
    ...mockInstanceSettings,
    jsonData: {
      ...mockInstanceSettings.jsonData,
      allowCleartextPasswords: false,
      tlsAuth: false,
      tlsAuthWithCACert: false,
      tlsSkipVerify: false,
      maxIdleConns: 1,
      maxOpenConns: 1,
      maxIdleConnsAuto: true,
      connMaxLifetime: 1,
      timezone: '',
      user: '',
      database: '',
      url: '',
      timeInterval: '',
    },
  };
  const ds = new FlightSQLDatasource(instanceSettings, templateSrv);

  it('should add template variables to the responses', async () => {
    const fields = await ds.fetchFields({ dataset: 'test', table: 'table' });
    expect(fields[0].name).toBe('$templateVar');
  });

  it('should return dotted table names without SQL quoting', async () => {
    const tables = await ds.fetchTables('iox');
    expect(tables).toContain('sensor.light');
    expect(tables).not.toContain('"sensor.light"');
  });
});
