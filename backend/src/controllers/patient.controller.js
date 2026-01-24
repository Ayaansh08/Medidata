import { getPatients, addPatient } from '../services/supabase.service.js';

export async function fetchPatients(req, res) {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPatient(req, res) {
  try {
    const { name, phone, purchase_date, medicines } = req.body;

    if (!name || !purchase_date || !medicines) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await addPatient({ name, phone, purchase_date, medicines });
    res.status(201).json({ message: 'Patient added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
