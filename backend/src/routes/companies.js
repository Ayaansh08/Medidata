import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/* ---------------- GET /api/companies ---------------- */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_companies');
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- POST /api/companies ---------------- */
router.post('/', async (req, res) => {
  try {
    const { company_name, medicines } = req.body;

    if (!company_name || !medicines) {
      return res.status(400).json({
        error: 'company_name and medicines are required',
      });
    }

    const { error } = await supabase.rpc('add_company', {
      p_company_name: company_name,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.status(201).json({ message: 'Company added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- PUT /api/companies/:id ---------------- */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { company_name, medicines } = req.body;

    if (!company_name || !medicines) {
      return res.status(400).json({
        error: 'company_name and medicines are required',
      });
    }

    const { error } = await supabase.rpc('update_company', {
      p_id: id,
      p_company_name: company_name,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.json({ message: 'Company updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE /api/companies/:id ---------------- */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.rpc('delete_company', {
      p_id: id,
    });

    if (error) throw error;

    res.json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
