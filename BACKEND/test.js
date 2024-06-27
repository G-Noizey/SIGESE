
const pool = require('./db');

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err);
  }
}

testConnection();
