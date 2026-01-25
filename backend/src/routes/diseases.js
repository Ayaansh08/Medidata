import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/* ---------------- GET /api/diseases ---------------- */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_diseases');
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- POST /api/diseases ---------------- */
router.post('/', async (req, res) => {
  try {
    const { disease_name, medicines } = req.body;

    if (!disease_name || !medicines) {
      return res.status(400).json({
        error: 'disease_name and medicines are required',
      });
    }

    const { error } = await supabase.rpc('add_disease', {
      p_disease_name: disease_name,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.status(201).json({ message: 'Disease added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- PUT /api/diseases/:id ---------------- */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { disease_name, medicines } = req.body;

    if (!disease_name || !medicines) {
      return res.status(400).json({
        error: 'disease_name and medicines are required',
      });
    }

    const { error } = await supabase.rpc('update_disease', {
      p_id: id,
      p_disease_name: disease_name,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.json({ message: 'Disease updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE /api/diseases/:id ---------------- */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.rpc('delete_disease', {
      p_id: id,
    });

    if (error) throw error;

    res.json({ message: 'Disease deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
