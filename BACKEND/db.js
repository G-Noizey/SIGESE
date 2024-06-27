const mysql = require('mysql2/promise'); // Importa mysql2 en modo promesa
const dotenv = require('dotenv');

dotenv.config(); // Cargar variables de entorno desde .env

// Configuración del pool de conexiones a la base de datos
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  queueLimit: 0
});

// Probar la conexión
pool.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = pool;
