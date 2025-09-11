import { tableConfigs } from '../config/tableConfigs';
import { RelationshipConfig } from './types';

const buildJoinSelect = (relName: string, relConfig: RelationshipConfig): string => {
    if (!relConfig) return '';

    const allFields = tableConfigs[relConfig.table as keyof typeof tableConfigs];
    if (!allFields) throw new Error(`No field config for table: ${relConfig.table}`);

    const selectedFields = relConfig.fields ? relConfig.fields : allFields;

    return selectedFields
      .map((field: string) => {
        const alias = field === 'id' ? `${relName}_id` : `${relName}_${field}`;
        return `${relConfig.table}.${field} AS ${alias}`;
      })
      .join(', ');
};