import { supabase } from '../config/supabase.js';

/* ---------------- GET PATIENTS ---------------- */
export async function getPatients() {
  const { data, error } = await supabase.rpc('get_patients');
  if (error) throw error;
  return data;
}

/* ---------------- ADD PATIENT ---------------- */
export async function addPatient(patient) {
  const { error } = await supabase.rpc('add_patient', {
    p_name: patient.name,
    p_phone: patient.phone,
    p_purchase_date: patient.purchase_date,
    p_medicines: patient.medicines,
  });
  if (error) throw error;
}

/* ---------------- UPDATE PATIENT ---------------- */
export async function updatePatient(patient) {
  const { error } = await supabase.rpc('update_patient', {
    p_id: patient.id,
    p_name: patient.name,
    p_phone: patient.phone,
    p_purchase_date: patient.purchase_date,
    p_medicines: patient.medicines,
  });
  if (error) throw error;
}

/* ---------------- DELETE PATIENT ---------------- */
export async function deletePatient(id) {
  const { error } = await supabase.rpc('delete_patient', {
    p_id: id,
  });
  if (error) throw error;
}
