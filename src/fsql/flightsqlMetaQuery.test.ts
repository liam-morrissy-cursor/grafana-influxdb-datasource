import { buildColumnQuery } from './flightsqlMetaQuery';

describe('buildColumnQuery', () => {
  it('treats dots in a table name as part of the name when the schema is provided', () => {
    expect(buildColumnQuery('Windows.PerfCounters.Memory', 'iox')).toBe(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'iox' AND table_name = 'Windows.PerfCounters.Memory' ORDER BY column_name"
    );
  });

  it('supports a schema-qualified table when the schema is not provided separately', () => {
    expect(buildColumnQuery('iox.Windows.PerfCounters.Memory')).toBe(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'iox' AND table_name = 'Windows.PerfCounters.Memory' ORDER BY column_name"
    );
  });
});
