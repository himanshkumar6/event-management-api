const pool = require('./db');

const createEvent = async (event) => {
  const { id, title, date_time, location, capacity } = event;
  const query = 'INSERT INTO events (id, title, date_time, location, capacity) VALUES ($1, $2, $3, $4, $5)';
  await pool.query(query, [id, title, date_time, location, capacity]);
};

module.exports = { createEvent };
