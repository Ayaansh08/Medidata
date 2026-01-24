const API_BASE_URL = 'http:/192.168.1.11:5000/api'; // Change to Render URL for production

// ✅ EXPORTED Interface - now available everywhere
export interface Patient {
  id: string;
  name: string;
  phone: string;
  date: string;
  medicines: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const apiService = {
  async getPatients(): Promise<Patient[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Patient[]> = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      return [];
    }
  },

  async addPatient(patient: Omit<Patient, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to add patient:', error);
      return false;
    }
  },
};
