require('dotenv').config();
const express = require('express');
const app = express();


app.use(express.json());


const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');



app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
