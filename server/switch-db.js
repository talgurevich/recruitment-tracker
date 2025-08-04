const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const mode = args[0];

const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const sqliteSchemaPath = path.join(__dirname, 'prisma', 'schema.local.prisma');
const postgresSchemaPath = path.join(__dirname, 'prisma', 'schema.production.prisma');

if (mode === 'local') {
  // Create PostgreSQL schema backup if it doesn't exist
  if (!fs.existsSync(postgresSchemaPath)) {
    fs.copyFileSync(schemaPath, postgresSchemaPath);
  }
  
  // Switch to SQLite
  const sqliteSchema = fs.readFileSync(schemaPath, 'utf8')
    .replace('provider = "postgresql"', 'provider = "sqlite"');
  
  fs.writeFileSync(schemaPath, sqliteSchema);
  console.log('✅ Switched to SQLite for local development');
  console.log('Run: npx prisma generate');
  
} else if (mode === 'production') {
  // Switch to PostgreSQL
  const postgresSchema = fs.readFileSync(schemaPath, 'utf8')
    .replace('provider = "sqlite"', 'provider = "postgresql"');
  
  fs.writeFileSync(schemaPath, postgresSchema);
  console.log('✅ Switched to PostgreSQL for production');
  console.log('Run: npx prisma generate');
  
} else {
  console.log('Usage: node switch-db.js [local|production]');
}