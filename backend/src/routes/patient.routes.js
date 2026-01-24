import express from 'express';
import { fetchPatients, createPatient } from '../controllers/patient.controller.js';

const router = express.Router();

router.get('/patients', fetchPatients);
router.post('/patients', createPatient);

export default router;
