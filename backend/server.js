import dotenv from 'dotenv';
dotenv.config(); // MUST be first

import express from 'express';
import cors from 'cors';
import patientRoutes from './src/routes/patient.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
