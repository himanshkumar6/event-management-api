const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db');

exports.createEvent = async (req, res) => {
  try {
    const { title, date_time, location, capacity } = req.body;
    if (capacity <= 0 || capacity > 1000) {
      return res.status(400).json({ message: 'Capacity must be between 1 and 1000' });
    }
    const id = uuidv4();
    await pool.query('INSERT INTO events (id, title, date_time, location, capacity) VALUES ($1, $2, $3, $4, $5)', [id, title, date_time, location, capacity]);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getEventDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rowCount === 0) return res.status(404).json({ message: 'Event not found' });

    const usersResult = await pool.query(
      `SELECT users.id, users.name, users.email FROM users 
             INNER JOIN registrations ON users.id = registrations.user_id 
             WHERE registrations.event_id = $1`, [id]);

    res.status(200).json({
      ...eventResult.rows[0],
      registrations: usersResult.rows
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const { user_id } = req.body;

    const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [event_id]);
    if (eventCheck.rowCount === 0) return res.status(404).json({ message: 'Event not found' });

    const event = eventCheck.rows[0];
    const currentDate = new Date();
    if (new Date(event.date_time) < currentDate) return res.status(400).json({ message: 'Cannot register for past event' });

    const regCheck = await pool.query('SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2', [user_id, event_id]);
    if (regCheck.rowCount > 0) return res.status(400).json({ message: 'Already registered' });

    const countResult = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [event_id]);
    if (parseInt(countResult.rows[0].count) >= event.capacity) return res.status(400).json({ message: 'Event full' });

    await pool.query('INSERT INTO registrations (user_id, event_id) VALUES ($1, $2)', [user_id, event_id]);
    res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const { id: event_id } = req.params;
    const { user_id } = req.body;

    const regCheck = await pool.query('SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2', [user_id, event_id]);
    if (regCheck.rowCount === 0) return res.status(400).json({ message: 'User not registered for this event' });

    await pool.query('DELETE FROM registrations WHERE user_id = $1 AND event_id = $2', [user_id, event_id]);
    res.status(200).json({ message: 'Registration cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.listUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const events = await pool.query(
      `SELECT * FROM events WHERE date_time > $1 ORDER BY date_time ASC, location ASC`,
      [currentDate]
    );
    res.status(200).json(events.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const { id } = req.params;
    const eventResult = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (eventResult.rowCount === 0) return res.status(404).json({ message: 'Event not found' });

    const event = eventResult.rows[0];
    const countResult = await pool.query('SELECT COUNT(*) FROM registrations WHERE event_id = $1', [id]);
    const totalRegistrations = parseInt(countResult.rows[0].count);
    const remaining = event.capacity - totalRegistrations;
    const percentageUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

    res.status(200).json({
      totalRegistrations,
      remainingCapacity: remaining,
      percentageUsed: `${percentageUsed}%`
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
