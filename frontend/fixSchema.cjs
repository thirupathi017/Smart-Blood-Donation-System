const mysql = require('mysql2/promise');

async function fixSchema() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '170826',
    database: 'bloodlinking'
  });

  try {
    const [result] = await connection.execute(
      'ALTER TABLE blood_requests ADD COLUMN donor_id INT, ADD FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE SET NULL'
    );
    console.log('Added donor_id column successfully.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('donor_id column already exists.');
    } else {
      console.error('Failed to alter table:', err);
    }
  }
  
  await connection.end();
}

fixSchema().catch(console.error);
