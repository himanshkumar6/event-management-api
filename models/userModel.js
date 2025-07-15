const pool = require('./db');

const createUser = async (user) => {
  const { id, name, email } = user;
  
  const query = 'INSERT INTO users (id, name, email) VALUES ($1, $2, $3)';
  await pool.query(query, [id, name, email]);
};

module.exports = { createUser };
