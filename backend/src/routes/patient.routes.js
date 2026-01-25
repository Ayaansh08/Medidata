import express from 'express';
import {
  fetchPatients,
  createPatient,
  editPatient,
  removePatient,
} from '../controllers/patient.controller.js';

const router = express.Router();

/* -------- KEEP AS-IS -------- */
router.get('/patients', fetchPatients);
router.post('/patients', createPatient);

/* -------- ADD THESE -------- */
router.put('/patients/:id', editPatient);
router.delete('/patients/:id', removePatient);

export default router;
