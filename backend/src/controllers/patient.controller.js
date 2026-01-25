import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from '../services/supabase.service.js';

/* ---------------- GET ALL PATIENTS ---------------- */
export async function fetchPatients(req, res) {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- CREATE PATIENT ---------------- */
export async function createPatient(req, res) {
  try {
    const { name, phone, purchase_date, medicines } = req.body;

    if (!name || !purchase_date || !medicines) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await addPatient({
      name,
      phone: phone || '',
      purchase_date,
      medicines,
    });

    res.status(201).json({ message: 'Patient added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- UPDATE PATIENT ---------------- */
export async function editPatient(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, purchase_date, medicines } = req.body;

    if (!id || !name || !purchase_date || !medicines) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await updatePatient({
      id,
      name,
      phone: phone || '',
      purchase_date,
      medicines,
    });

    res.json({ message: 'Patient updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ---------------- DELETE PATIENT ---------------- */
export async function removePatient(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    await deletePatient(id);

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
