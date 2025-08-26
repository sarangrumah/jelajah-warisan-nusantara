export type RelationshipConfig = {
  table: string;
  localKey: string;
  foreignKey: string;
  type: 'inner' | 'left';
  fields?: string[];
};

export type FieldConfigs = {
  [tableName: string]: string[];
};