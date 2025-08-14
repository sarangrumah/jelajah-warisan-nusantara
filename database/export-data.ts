import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

// Data export utility for migrating from Supabase to local PostgreSQL
export class DataExporter {
  private async exportTable(tableName: string) {
    console.log(`Exporting ${tableName}...`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Error exporting ${tableName}:`, error);
      return null;
    }
    
    return data;
  }

  private async saveToFile(tableName: string, data: any[]) {
    const exportDir = path.join(process.cwd(), 'database', 'exports');
    
    // Create exports directory if it doesn't exist
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    const filePath = path.join(exportDir, `${tableName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Exported ${data.length} records from ${tableName} to ${filePath}`);
  }

  private generateInsertSQL(tableName: string, data: any[]): string {
    if (!data || data.length === 0) {
      return `-- No data to insert for ${tableName}\n`;
    }

    const columns = Object.keys(data[0]);
    let sql = `-- Insert data for ${tableName}\n`;
    sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n`;
    
    const values = data.map(row => {
      const vals = columns.map(col => {
        const val = row[col];
        if (val === null) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
        if (typeof val === 'boolean') return val.toString();
        if (Array.isArray(val)) return `ARRAY[${val.map(v => `'${v}'`).join(', ')}]`;
        if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
        return val.toString();
      });
      return `  (${vals.join(', ')})`;
    });
    
    sql += values.join(',\n');
    sql += ';\n\n';
    
    return sql;
  }

  private async saveSQLFile(tableName: string, data: any[]) {
    const exportDir = path.join(process.cwd(), 'database', 'exports');
    const sql = this.generateInsertSQL(tableName, data);
    const filePath = path.join(exportDir, `${tableName}.sql`);
    
    fs.writeFileSync(filePath, sql);
    console.log(`Generated SQL insert file: ${filePath}`);
  }

  async exportAllTables() {
    const tables = [
      'profiles',
      'user_roles',
      'content_sections',
      'banners',
      'news_articles',
      'agenda_items',
      'museums',
      'career_opportunities',
      'career_applications',
      'media_items',
      'faqs'
    ];

    const exportDir = path.join(process.cwd(), 'database', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    let masterSQL = '-- Master SQL file for data migration\n';
    masterSQL += '-- Run this file to import all data into your local PostgreSQL database\n\n';

    for (const table of tables) {
      try {
        const data = await this.exportTable(table);
        if (data) {
          await this.saveToFile(table, data);
          await this.saveSQLFile(table, data);
          masterSQL += this.generateInsertSQL(table, data);
        }
      } catch (error) {
        console.error(`Failed to export ${table}:`, error);
      }
    }

    // Save master SQL file
    const masterSQLPath = path.join(exportDir, 'import_all_data.sql');
    fs.writeFileSync(masterSQLPath, masterSQL);
    console.log(`Master SQL file created: ${masterSQLPath}`);

    console.log('\n✅ Data export completed!');
    console.log('\nNext steps:');
    console.log('1. Set up local PostgreSQL database');
    console.log('2. Run database/schema.sql to create tables');
    console.log('3. Run database/exports/import_all_data.sql to import data');
  }
}

// CLI script to run the export
if (require.main === module) {
  const exporter = new DataExporter();
  exporter.exportAllTables().catch(console.error);
}