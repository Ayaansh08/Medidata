// 🌐 Backend base URL (Render)
export const API_BASE_URL = 'https://medidata.onrender.com/api';

// =====================
// Types (Patients)
// =====================

export interface Medicine {
  name: string;
  qty: number;
  price: number; // MRP
}


export interface Patient {
  id: string;
  name: string;
  phone: string;
  purchase_date: string;
  medicines: Medicine[];
}

// =====================
// API Service (Patients)
// =====================

export const apiService = {
  // 🔹 GET all patients
  async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return [];
    }
  },

  // 🔹 ADD patient
  async addPatient(patient: Omit<Patient, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to add patient:', error);
      return false;
    }
  },

  // 🔹 UPDATE patient
  async updatePatient(id: string, patient: Omit<Patient, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update patient:', error);
      return false;
    }
  },

  // 🔹 DELETE patient
  async deletePatient(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete patient:', error);
      return false;
    }
  },
};
