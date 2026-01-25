import { API_BASE_URL } from './api';

export interface CompanyMedicine {
  name: string;
  mrp: number;
}

export interface Company {
  id: string;
  company_name: string;
  medicines: CompanyMedicine[];
}

export const companyApi = {
  async getCompanies(): Promise<Company[]> {
    const res = await fetch(`${API_BASE_URL}/companies`);
    return res.ok ? res.json() : [];
  },

  async addCompany(company: Omit<Company, 'id'>): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    return res.ok;
  },

  async updateCompany(id: string, company: Omit<Company, 'id'>): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(company),
    });
    return res.ok;
  },

  async deleteCompany(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },
};
