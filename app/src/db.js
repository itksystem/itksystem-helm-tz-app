const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER  || `demo`,
  password: process.env.DB_PASSWORD || `123456`,
  database: process.env.DB_NAME || `demo`,
});

connection.connect((err) => {
  try {
    if (err) throw err;
    console.log('Connected to MySQL');  
  } catch (error) {
    console.log(error);
    console.log('Disconnected to MySQL');  
  }  
});

module.exports = connection;

