/**
 * SchemaGen Tool
 * 
 * Creates database schemas based on data requirements
 * Generates migration scripts for schema changes
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

// Define schemas for SchemaGen tool
export const GenerateSchemaSchema = z.object({
  name: z.string(),
  type: z.enum(['postgresql', 'mysql', 'sqlite', 'mongodb', 'dynamodb', 'cosmosdb']),
  tables: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      columns: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          nullable: z.boolean().default(false),
          unique: z.boolean().default(false),
          primary: z.boolean().default(false),
          default: z.any().optional(),
          references: z.object({
            table: z.string(),
            column: z.string(),
            onDelete: z.enum(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION']).optional(),
            onUpdate: z.enum(['CASCADE', 'SET NULL', 'RESTRICT', 'NO ACTION']).optional(),
          }).optional(),
          description: z.string().optional(),
        })
      ),
      indexes: z.array(
        z.object({
          name: z.string().optional(),
          columns: z.array(z.string()),
          unique: z.boolean().default(false),
          type: z.enum(['BTREE', 'HASH', 'GIN', 'GIST', 'SPGIST', 'BRIN']).optional(),
        })
      ).optional(),
      constraints: z.array(
        z.object({
          name: z.string().optional(),
          type: z.enum(['CHECK', 'UNIQUE', 'FOREIGN KEY', 'PRIMARY KEY']),
          definition: z.string(),
        })
      ).optional(),
    })
  ),
  relationships: z.array(
    z.object({
      name: z.string().optional(),
      type: z.enum(['one-to-one', 'one-to-many', 'many-to-many']),
      from: z.object({
        table: z.string(),
        column: z.string(),
      }),
      to: z.object({
        table: z.string(),
        column: z.string(),
      }),
      junction: z.object({
        table: z.string(),
        fromColumn: z.string(),
        toColumn: z.string(),
      }).optional(),
    })
  ).optional(),
  outputDir: z.string().optional(),
  orm: z.enum(['sequelize', 'typeorm', 'prisma', 'mongoose', 'none']).optional(),
});

export const GenerateMigrationSchema = z.object({
  name: z.string(),
  type: z.enum(['postgresql', 'mysql', 'sqlite', 'mongodb']),
  changes: z.array(
    z.object({
      type: z.enum([
        'create-table',
        'drop-table',
        'rename-table',
        'add-column',
        'drop-column',
        'rename-column',
        'modify-column',
        'add-index',
        'drop-index',
        'add-constraint',
        'drop-constraint',
        'raw-sql'
      ]),
      table: z.string().optional(),
      newTable: z.string().optional(),
      column: z.string().optional(),
      newColumn: z.string().optional(),
      definition: z.any().optional(),
      sql: z.string().optional(),
    })
  ),
  outputDir: z.string().optional(),
  orm: z.enum(['sequelize', 'typeorm', 'prisma', 'mongoose', 'none']).optional(),
});

// Types for schema generation
interface Column {
  name: string;
  type: string;
  nullable: boolean;
  unique: boolean;
  primary: boolean;
  default?: any;
  references?: {
    table: string;
    column: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  };
  description?: string;
}

interface Index {
  name?: string;
  columns: string[];
  unique: boolean;
  type?: 'BTREE' | 'HASH' | 'GIN' | 'GIST' | 'SPGIST' | 'BRIN';
}

interface Constraint {
  name?: string;
  type: 'CHECK' | 'UNIQUE' | 'FOREIGN KEY' | 'PRIMARY KEY';
  definition: string;
}

interface Table {
  name: string;
  description?: string;
  columns: Column[];
  indexes?: Index[];
  constraints?: Constraint[];
}

interface Relationship {
  name?: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  from: {
    table: string;
    column: string;
  };
  to: {
    table: string;
    column: string;
  };
  junction?: {
    table: string;
    fromColumn: string;
    toColumn: string;
  };
}

interface SchemaOptions {
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'dynamodb' | 'cosmosdb';
  tables: Table[];
  relationships?: Relationship[];
  outputDir?: string;
  orm?: 'sequelize' | 'typeorm' | 'prisma' | 'mongoose' | 'none';
}

interface MigrationChange {
  type: 'create-table' | 'drop-table' | 'rename-table' | 'add-column' | 'drop-column' | 
        'rename-column' | 'modify-column' | 'add-index' | 'drop-index' | 'add-constraint' | 
        'drop-constraint' | 'raw-sql';
  table?: string;
  newTable?: string;
  column?: string;
  newColumn?: string;
  definition?: any;
  sql?: string;
}

interface MigrationOptions {
  name: string;
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  changes: MigrationChange[];
  outputDir?: string;
  orm?: 'sequelize' | 'typeorm' | 'prisma' | 'mongoose' | 'none';
}

// Helper functions
/**
 * Convert a string to camelCase
 */
function camelCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Convert a string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
    .replace(/\s+/g, '')
    .replace(/[-_]/g, '');
}

/**
 * Map a column type to the appropriate SQL type
 */
function mapColumnType(type: string, dbType: string): string {
  type = type.toLowerCase();
  
  // Common types
  if (type === 'string' || type === 'text' || type === 'varchar') {
    return dbType === 'postgresql' ? 'TEXT' : 'VARCHAR(255)';
  } else if (type === 'integer' || type === 'int') {
    return 'INTEGER';
  } else if (type === 'float' || type === 'double') {
    return dbType === 'postgresql' ? 'DOUBLE PRECISION' : 'DOUBLE';
  } else if (type === 'boolean' || type === 'bool') {
    return dbType === 'postgresql' ? 'BOOLEAN' : 'TINYINT(1)';
  } else if (type === 'date') {
    return 'DATE';
  } else if (type === 'datetime' || type === 'timestamp') {
    return dbType === 'postgresql' ? 'TIMESTAMP' : 'DATETIME';
  } else if (type === 'json' || type === 'jsonb') {
    return dbType === 'postgresql' ? 'JSONB' : 'JSON';
  } else if (type === 'uuid') {
    return dbType === 'postgresql' ? 'UUID' : 'VARCHAR(36)';
  }
  
  // Database-specific types
  if (dbType === 'postgresql') {
    if (type === 'serial') return 'SERIAL';
    if (type === 'bigserial') return 'BIGSERIAL';
    if (type === 'smallint') return 'SMALLINT';
    if (type === 'bigint') return 'BIGINT';
    if (type === 'real') return 'REAL';
    if (type === 'money') return 'MONEY';
    if (type === 'bytea') return 'BYTEA';
    if (type === 'interval') return 'INTERVAL';
    if (type === 'point') return 'POINT';
    if (type === 'line') return 'LINE';
    if (type === 'lseg') return 'LSEG';
    if (type === 'box') return 'BOX';
    if (type === 'path') return 'PATH';
    if (type === 'polygon') return 'POLYGON';
    if (type === 'circle') return 'CIRCLE';
    if (type === 'cidr') return 'CIDR';
    if (type === 'inet') return 'INET';
    if (type === 'macaddr') return 'MACADDR';
    if (type === 'bit') return 'BIT';
    if (type === 'varbit') return 'VARBIT';
    if (type === 'tsvector') return 'TSVECTOR';
    if (type === 'tsquery') return 'TSQUERY';
    if (type === 'xml') return 'XML';
  } else if (dbType === 'mysql') {
    if (type === 'tinyint') return 'TINYINT';
    if (type === 'smallint') return 'SMALLINT';
    if (type === 'mediumint') return 'MEDIUMINT';
    if (type === 'bigint') return 'BIGINT';
    if (type === 'decimal') return 'DECIMAL';
    if (type === 'bit') return 'BIT';
    if (type === 'tinytext') return 'TINYTEXT';
    if (type === 'mediumtext') return 'MEDIUMTEXT';
    if (type === 'longtext') return 'LONGTEXT';
    if (type === 'binary') return 'BINARY';
    if (type === 'varbinary') return 'VARBINARY';
    if (type === 'tinyblob') return 'TINYBLOB';
    if (type === 'blob') return 'BLOB';
    if (type === 'mediumblob') return 'MEDIUMBLOB';
    if (type === 'longblob') return 'LONGBLOB';
    if (type === 'enum') return 'ENUM';
    if (type === 'set') return 'SET';
    if (type === 'time') return 'TIME';
    if (type === 'year') return 'YEAR';
  }
  
  // If no match, return the original type
  return type.toUpperCase();
}

/**
 * Format a default value for SQL
 */
function formatDefaultValue(value: any, dbType: string): string {
  if (value === null) {
    return 'NULL';
  } else if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`;
  } else if (typeof value === 'boolean') {
    if (dbType === 'postgresql') {
      return value ? 'TRUE' : 'FALSE';
    } else {
      return value ? '1' : '0';
    }
  } else if (value === 'CURRENT_TIMESTAMP' || value === 'NOW()') {
    if (dbType === 'postgresql') {
      return 'CURRENT_TIMESTAMP';
    } else if (dbType === 'mysql') {
      return 'CURRENT_TIMESTAMP';
    } else {
      return "DATETIME('now')";
    }
  } else if (value === 'UUID()' || value === 'uuid_generate_v4()') {
    if (dbType === 'postgresql') {
      return 'uuid_generate_v4()';
    } else {
      return 'UUID()';
    }
  } else if (typeof value === 'object') {
    return `'${JSON.stringify(value)}'`;
  }
  
  return String(value);
}

/**
 * Map a column type to the appropriate MongoDB type
 */
function mapMongoType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'text' || type === 'varchar') {
    return 'string';
  } else if (type === 'integer' || type === 'int' || type === 'smallint' || type === 'mediumint' || type === 'bigint') {
    return 'int';
  } else if (type === 'float' || type === 'double' || type === 'decimal' || type === 'real') {
    return 'double';
  } else if (type === 'boolean' || type === 'bool') {
    return 'bool';
  } else if (type === 'date' || type === 'datetime' || type === 'timestamp') {
    return 'date';
  } else if (type === 'objectid') {
    return 'objectId';
  } else if (type === 'array') {
    return 'array';
  } else if (type === 'object' || type === 'json' || type === 'jsonb') {
    return 'object';
  } else if (type === 'binary' || type === 'blob') {
    return 'binData';
  }
  
  return 'string';
}

/**
 * Map a column type to the appropriate DynamoDB type
 */
function mapDynamoType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'text' || type === 'varchar' || type === 'uuid') {
    return 'S';
  } else if (type === 'integer' || type === 'int' || type === 'smallint' || type === 'mediumint' || type === 'bigint' || 
             type === 'float' || type === 'double' || type === 'decimal' || type === 'real') {
    return 'N';
  } else if (type === 'boolean' || type === 'bool') {
    return 'BOOL';
  } else if (type === 'binary' || type === 'blob') {
    return 'B';
  } else if (type === 'array' || type === 'list') {
    return 'L';
  } else if (type === 'object' || type === 'json' || type === 'jsonb' || type === 'map') {
    return 'M';
  } else if (type === 'stringset') {
    return 'SS';
  } else if (type === 'numberset') {
    return 'NS';
  } else if (type === 'binaryset') {
    return 'BS';
  }
  
  return 'S';
}

/**
 * Map a column type to the appropriate Sequelize type
 */
function mapSequelizeType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'varchar') {
    return 'DataTypes.STRING';
  } else if (type === 'text') {
    return 'DataTypes.TEXT';
  } else if (type === 'integer' || type === 'int') {
    return 'DataTypes.INTEGER';
  } else if (type === 'float') {
    return 'DataTypes.FLOAT';
  } else if (type === 'double') {
    return 'DataTypes.DOUBLE';
  } else if (type === 'decimal') {
    return 'DataTypes.DECIMAL';
  } else if (type === 'boolean' || type === 'bool') {
    return 'DataTypes.BOOLEAN';
  } else if (type === 'date') {
    return 'DataTypes.DATEONLY';
  } else if (type === 'datetime' || type === 'timestamp') {
    return 'DataTypes.DATE';
  } else if (type === 'time') {
    return 'DataTypes.TIME';
  } else if (type === 'uuid') {
    return 'DataTypes.UUID';
  } else if (type === 'json' || type === 'jsonb') {
    return 'DataTypes.JSON';
  } else if (type === 'array') {
    return 'DataTypes.ARRAY(DataTypes.STRING)';
  } else if (type === 'binary' || type === 'blob') {
    return 'DataTypes.BLOB';
  } else if (type === 'enum') {
    return 'DataTypes.ENUM';
  }
  
  return 'DataTypes.STRING';
}

/**
 * Map a column type to the appropriate TypeORM type
 */
function mapTypeOrmType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'varchar') {
    return 'varchar';
  } else if (type === 'text') {
    return 'text';
  } else if (type === 'integer' || type === 'int') {
    return 'int';
  } else if (type === 'float') {
    return 'float';
  } else if (type === 'double') {
    return 'double';
  } else if (type === 'decimal') {
    return 'decimal';
  } else if (type === 'boolean' || type === 'bool') {
    return 'boolean';
  } else if (type === 'date') {
    return 'date';
  } else if (type === 'datetime' || type === 'timestamp') {
    return 'timestamp';
  } else if (type === 'time') {
    return 'time';
  } else if (type === 'uuid') {
    return 'uuid';
  } else if (type === 'json') {
    return 'json';
  } else if (type === 'jsonb') {
    return 'jsonb';
  } else if (type === 'enum') {
    return 'enum';
  } else if (type === 'simple-array') {
    return 'simple-array';
  } else if (type === 'simple-json') {
    return 'simple-json';
  }
  
  return 'varchar';
}

/**
 * Map a column type to the appropriate TypeScript type
 */
function mapTypeScriptType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'text' || type === 'varchar' || type === 'char') {
    return 'string';
  } else if (type === 'integer' || type === 'int' || type === 'smallint' || type === 'mediumint' || type === 'bigint' || 
             type === 'float' || type === 'double' || type === 'decimal' || type === 'real') {
    return 'number';
  } else if (type === 'boolean' || type === 'bool') {
    return 'boolean';
  } else if (type === 'date' || type === 'datetime' || type === 'timestamp') {
    return 'Date';
  } else if (type === 'json' || type === 'jsonb') {
    return 'any';
  } else if (type === 'array') {
    return 'any[]';
  } else if (type === 'uuid') {
    return 'string';
  } else if (type === 'object') {
    return 'Record<string, any>';
  }
  
  return 'any';
}

/**
 * Map a column type to the appropriate Prisma type
 */
function mapPrismaType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'varchar' || type === 'char') {
    return 'String';
  } else if (type === 'text') {
    return 'String @db.Text';
  } else if (type === 'integer' || type === 'int') {
    return 'Int';
  } else if (type === 'float' || type === 'double' || type === 'decimal' || type === 'real') {
    return 'Float';
  } else if (type === 'boolean' || type === 'bool') {
    return 'Boolean';
  } else if (type === 'date') {
    return 'DateTime @db.Date';
  } else if (type === 'datetime' || type === 'timestamp') {
    return 'DateTime';
  } else if (type === 'json' || type === 'jsonb') {
    return 'Json';
  } else if (type === 'uuid') {
    return 'String @db.Uuid';
  } else if (type === 'bigint') {
    return 'BigInt';
  } else if (type === 'bytes' || type === 'binary' || type === 'blob') {
    return 'Bytes';
  }
  
  return 'String';
}

/**
 * Format a default value for Prisma
 */
function formatPrismaDefault(value: any, type: string): string {
  if (value === null) {
    return 'null';
  } else if (typeof value === 'string') {
    if (value === 'CURRENT_TIMESTAMP' || value === 'NOW()') {
      return 'now()';
    } else if (value === 'UUID()' || value === 'uuid_generate_v4()') {
      return 'uuid()';
    } else {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (typeof value === 'object') {
    return `dbgenerated("${JSON.stringify(value).replace(/"/g, '\\"')}")`;
  }
  
  return String(value);
}

/**
 * Map a column type to the appropriate Mongoose type
 */
function mapMongooseType(type: string): string {
  type = type.toLowerCase();
  
  if (type === 'string' || type === 'text' || type === 'varchar' || type === 'char') {
    return 'String';
  } else if (type === 'integer' || type === 'int' || type === 'smallint' || type === 'mediumint' || type === 'bigint' || 
             type === 'float' || type === 'double' || type === 'decimal' || type === 'real') {
    return 'Number';
  } else if (type === 'boolean' || type === 'bool') {
    return 'Boolean';
  } else if (type === 'date' || type === 'datetime' || type === 'timestamp') {
    return 'Date';
  } else if (type === 'objectid') {
    return 'Schema.Types.ObjectId';
  } else if (type === 'array') {
    return '[]';
  } else if (type === 'object' || type === 'json' || type === 'jsonb') {
    return 'Schema.Types.Mixed';
  } else if (type === 'buffer' || type === 'binary' || type === 'blob') {
    return 'Buffer';
  } else if (type === 'map') {
    return 'Map';
  }
  
  return 'String';
}

/**
 * Map a database type to the appropriate Prisma provider
 */
function mapPrismaProvider(dbType: string): string {
  switch (dbType) {
    case 'postgresql':
      return 'postgresql';
    case 'mysql':
      return 'mysql';
    case 'sqlite':
      return 'sqlite';
    case 'mongodb':
      return 'mongodb';
    default:
      return 'postgresql';
  }
}

/**
 * Generate database schema
 */
export async function handleGenerateSchema(args: any) {
  try {
    const options = args as SchemaOptions;
    
    // Validate the database type
    if (!['postgresql', 'mysql', 'sqlite', 'mongodb', 'dynamodb', 'cosmosdb'].includes(options.type)) {
      return {
        content: [{ type: "text", text: `Error: Unsupported database type: ${options.type}` }],
        isError: true,
      };
    }
    
    // Generate the schema based on the database type
    const schemaFiles = generateSchema(options);
    
    // Determine the output directory
    const outputDir = options.outputDir || './schemas';
    
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write the schema files to disk
    const writtenFiles = [];
    for (const [filename, content] of Object.entries(schemaFiles)) {
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, content);
      writtenFiles.push(filePath);
    }
    
    return {
      content: [{
        type: "text",
        text: `Successfully generated schema files for ${options.name}:\n${writtenFiles.join('\n')}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating schema: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate migration script
 */
export async function handleGenerateMigration(args: any) {
  try {
    const options = args as MigrationOptions;
    
    // Validate the database type
    if (!['postgresql', 'mysql', 'sqlite', 'mongodb'].includes(options.type)) {
      return {
        content: [{ type: "text", text: `Error: Unsupported database type for migration: ${options.type}` }],
        isError: true,
      };
    }
    
    // Generate the migration based on the database type
    const migrationFiles = generateMigration(options);
    
    // Determine the output directory
    const outputDir = options.outputDir || './migrations';
    
    // Ensure the output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write the migration files to disk
    const writtenFiles = [];
    for (const [filename, content] of Object.entries(migrationFiles)) {
      const filePath = path.join(outputDir, filename);
      await fs.writeFile(filePath, content);
      writtenFiles.push(filePath);
    }
    
    return {
      content: [{
        type: "text",
        text: `Successfully generated migration files for ${options.name}:\n${writtenFiles.join('\n')}`
      }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error generating migration: ${error}` }],
      isError: true,
    };
  }
}

/**
 * Generate schema files based on options
 */
function generateSchema(options: SchemaOptions): Record<string, string> {
  const files: Record<string, string> = {};
  
  switch (options.type) {
    case 'postgresql':
    case 'mysql':
    case 'sqlite':
const schemaFiles = generateSchema(options);
Object.entries(schemaFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
    case 'mongodb':
const mongoFiles = generateSchema(options);
Object.entries(mongoFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
    case 'dynamodb':
const dynamoFiles = generateSchema(options);
Object.entries(dynamoFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
    case 'cosmosdb':
const cosmosFiles = generateSchema(options);
Object.entries(cosmosFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
  }
  
  // Generate ORM-specific files if requested
  if (options.orm) {
    switch (options.orm) {
      case 'sequelize':
const sequelizeFiles = generateSchema(options);
Object.entries(sequelizeFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
      case 'typeorm':
        options.tables.forEach(table => {
          const typeOrmFiles = generateSchema(options);
          Object.entries(typeOrmFiles).forEach(([filename, content]) => {
            files[filename] = content;
          });
        });
        break;
      case 'prisma':
const prismaFiles = generateSchema(options);
Object.entries(prismaFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
      case 'mongoose':
        options.tables.forEach(table => {
const mongooseFiles = generateSchema(options);
Object.entries(mongooseFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        });
        break;
    }
  }
  
  return files;
}

/**
 * Generate migration files based on options
 */
function generateMigration(options: MigrationOptions): Record<string, string> {
  const files: Record<string, string> = {};
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
  
  switch (options.type) {
    case 'postgresql':
    case 'mysql':
    case 'sqlite':
const migrationFiles = generateMigration(options);
Object.entries(migrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      
      // Generate down migration (rollback)
const rollbackFiles = generateMigration(options);
Object.entries(rollbackFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
    case 'mongodb':
const mongoMigrationFiles = generateMigration(options);
Object.entries(mongoMigrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      
      // Generate down migration (rollback)
const mongoRollbackFiles = generateMigration(options);
Object.entries(mongoRollbackFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
      break;
  }
  
  // Generate ORM-specific migration files if requested
  if (options.orm) {
    switch (options.orm) {
      case 'sequelize':
const sequelizeMigrationFiles = generateMigration(options);
Object.entries(sequelizeMigrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
      case 'typeorm':
const typeOrmMigrationFiles = generateMigration(options);
Object.entries(typeOrmMigrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
      case 'prisma':
const prismaMigrationFiles = generateMigration(options);
Object.entries(prismaMigrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
      case 'mongoose':
const mongooseMigrationFiles = generateMigration(options);
Object.entries(mongooseMigrationFiles).forEach(([filename, content]) => {
  files[filename] = content;
});
        break;
    }
  }
  
  return files;
}

/**
 * Generate SQL schema for PostgreSQL, MySQL, or SQLite
 */
