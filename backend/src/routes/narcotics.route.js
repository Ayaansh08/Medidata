import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

/* ---------------- GET /api/narcotics ---------------- */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('get_narcotics');
    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- POST /api/narcotics ---------------- */
router.post('/', async (req, res) => {
  try {
    const { name, phone, purchase_date, medicines } = req.body;

    if (!name || !phone || !purchase_date || !medicines) {
      return res.status(400).json({
        error: 'name, phone, purchase_date, and medicines are required',
      });
    }

    const { error } = await supabase.rpc('add_narcotic', {
      p_name: name,
      p_phone: phone,
      p_purchase_date: purchase_date,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.status(201).json({ message: 'Narcotic record added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- PUT /api/narcotics/:id ---------------- */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, purchase_date, medicines } = req.body;

    if (!name || !phone || !purchase_date || !medicines) {
      return res.status(400).json({
        error: 'name, phone, purchase_date, and medicines are required',
      });
    }

    const { error } = await supabase.rpc('update_narcotic', {
      p_id: id,
      p_name: name,
      p_phone: phone,
      p_purchase_date: purchase_date,
      p_medicines: medicines,
    });

    if (error) throw error;

    res.json({ message: 'Narcotic record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- DELETE /api/narcotics/:id ---------------- */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.rpc('delete_narcotic', {
      p_id: id,
    });

    if (error) throw error;

    res.json({ message: 'Narcotic record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
