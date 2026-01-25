import { API_BASE_URL } from './api';

export interface DiseaseMedicine {
  name: string;
  qty: number;
}

export interface Disease {
  id: string;
  disease_name: string;
  medicines: DiseaseMedicine[];
}

export const diseaseApi = {
  async getDiseases(): Promise<Disease[]> {
    const res = await fetch(`${API_BASE_URL}/diseases`);
    return res.ok ? res.json() : [];
  },

  async addDisease(disease: Omit<Disease, 'id'>): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/diseases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disease),
    });
    return res.ok;
  },

  async updateDisease(id: string, disease: Omit<Disease, 'id'>): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/diseases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disease),
    });
    return res.ok;
  },

  async deleteDisease(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/diseases/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },
};
