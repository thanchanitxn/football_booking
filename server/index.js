const express = require('express');
const cors = require('cors');
require('dotenv').config();
const matchesRoutes = require('./routes/matches');
const seatsRouter = require('./routes/seats');
const usersRouter = require('./routes/users');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');
const registersRouter = require('./routes/registers');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/matches', matchesRoutes);
app.use('/api/seats', seatsRouter);
app.use('/api/users', usersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/registers', registersRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
