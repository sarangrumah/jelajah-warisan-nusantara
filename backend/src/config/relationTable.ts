import { tableConfigs } from '../config/tableConfigs';

/**
 * Builds a JSON aggregation subquery for "has many" relations
 */
export const buildHasManySelect = (
  parentTable: string,
  relKey: string,
  relConfig: JoinConfig
): string => {
  const { table: childTable, localKey, fields } = relConfig;

  const allFields = fields || Object.keys(tableConfigs[childTable] || {});
  const selectedFields = allFields.filter(f => f !== localKey); // exclude foreignKey

  const jsonFields = selectedFields
    .map(f => `'${f}', ${childTable}.${f}`)
    .join(', ');

  return `
    (SELECT json_agg(json_build_object(${jsonFields}))
     FROM ${childTable}
     WHERE ${childTable}.${localKey} = ${parentTable}.id
    ) AS ${relKey}`;
};