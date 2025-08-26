const buildJoinSelect = (relName: string, relConfig: typeof relation): string => {
    if (!relConfig) return '';

    const allFields = tableConfigs[relConfig.table];
    if (!allFields) throw new Error(`No field config for table: ${relConfig.table}`);

    const selectedFields = relConfig.fields ? relConfig.fields : allFields;

    return selectedFields
      .map(field => {
        const alias = field === 'id' ? `${relName}_id` : `${relName}_${field}`;
        return `${relConfig.table}.${field} AS ${alias}`;
      })
      .join(', ');
  };