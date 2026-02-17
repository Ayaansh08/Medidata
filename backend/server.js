import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import patientRoutes from './src/routes/patient.routes.js';
import diseasesRoutes from './src/routes/diseases.js';
import companiesRoutes from './src/routes/companies.js';
import narcoticsRoutes from './src/routes/narcotics.route.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', patientRoutes);
app.use('/api/diseases', diseasesRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/narcotics', narcoticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
