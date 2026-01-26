import express from 'express';
import bookingRoutes from './routes/bookings';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
