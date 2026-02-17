export const API_BASE_URL = 'https://medidata.onrender.com/api';

export interface Medicine {
  name: string;
  qty: number;
  price: number;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  purchase_date: string;
  medicines: Medicine[];
}

export interface Narcotic {
  id: string;
  name: string;
  phone: string;
  purchase_date: string;
  medicines: Medicine[];
}

export const apiService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return [];
    }
  },

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

  async getNarcotics(): Promise<Narcotic[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/narcotics`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch narcotics:', error);
      return [];
    }
  },

  async addNarcotic(record: Omit<Narcotic, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/narcotics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to add narcotic:', error);
      return false;
    }
  },

  async updateNarcotic(id: string, record: Omit<Narcotic, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/narcotics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to update narcotic:', error);
      return false;
    }
  },

  async deleteNarcotic(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/narcotics/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to delete narcotic:', error);
      return false;
    }
  },
};
