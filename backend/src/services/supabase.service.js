import { supabase } from '../config/supabase.js';

export async function getPatients() {
  const { data, error } = await supabase.rpc('get_patients');
  if (error) throw error;
  return data;
}

export async function addPatient(patient) {
  const { error } = await supabase.rpc('add_patient', {
    p_name: patient.name,
    p_phone: patient.phone,
    p_purchase_date: patient.purchase_date,
    p_medicines: patient.medicines
  });
  if (error) throw error;
}
