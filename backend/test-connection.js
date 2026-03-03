// Simple database connection test
require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('📊 Connection string:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    const client = await pool.connect();
    console.log('✅✅✅ SUCCESS! Connected to database');
    
    // Test query
    const result = await client.query('SELECT version() as version');
    console.log('📅 PostgreSQL version:', result.rows[0].version);
    
    // Test creating a table
    await client.query(`
      CREATE TABLE IF NOT EXISTS connection_test (
        id SERIAL PRIMARY KEY,
        test_time TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Test table created/verified');
    
    client.release();
    await pool.end();
    console.log('👋 Connection closed');
    return true;
  } catch (error) {
    console.error('❌❌❌ FAILED:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Check if DATABASE_URL in .env is correct');
    console.error('2. Verify password is correct');
    console.error('3. Check network connection');
    return false;
  }
}

testConnection();