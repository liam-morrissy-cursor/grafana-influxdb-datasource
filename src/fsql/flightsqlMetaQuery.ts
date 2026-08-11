import { quoteLiteral, unquoteIdentifier } from './sqlUtil';

export function buildTableQuery(dataset?: string) {
  const database = dataset !== undefined ? quoteIdentAsLiteral(dataset) : 'database()';
  return `SELECT table_name FROM information_schema.tables WHERE table_schema = ${database} ORDER BY table_name`;
}

export function buildColumnQuery(table: string, dbName?: string) {
  let query = 'SELECT column_name, data_type FROM information_schema.columns WHERE ';
  query += buildTableConstraint(table, dbName);

  query += ' ORDER BY column_name';

  return query;
}

function buildTableConstraint(table: string, dbName?: string) {
  if (dbName !== undefined) {
    return `table_schema = ${quoteIdentAsLiteral(dbName)} AND table_name = ${quoteIdentAsLiteral(table)}`;
  }

  if (table.includes('.')) {
    const [schema, ...tableParts] = table.split('.');
    return `table_schema = ${quoteIdentAsLiteral(schema)} AND table_name = ${quoteIdentAsLiteral(tableParts.join('.'))}`;
  }

  return `table_schema = database() AND table_name = ${quoteIdentAsLiteral(table)}`;
}

function quoteIdentAsLiteral(value: string) {
  return quoteLiteral(unquoteIdentifier(value));
}
