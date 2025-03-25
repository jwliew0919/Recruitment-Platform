import axios from 'axios';
import authService from './auth.service';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/candidates/`;

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  experience_years?: number;
  location?: string;
  availability?: boolean;
  created_at: string;
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  experience_years?: number;
  location?: string;
  availability?: boolean;
}

class CandidateService {
  private getAuthHeader() {
    const token = authService.getCurrentToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllCandidates(): Promise<Candidate[]> {
    const response = await axios.get(API_URL, { headers: this.getAuthHeader() });
    return response.data;
  }

  async getCandidateById(id: number): Promise<Candidate> {
    const response = await axios.get(`${API_URL}${id}`, { headers: this.getAuthHeader() });
    return response.data;
  }

  async createCandidate(candidate: CreateCandidateDto): Promise<Candidate> {
    const response = await axios.post(API_URL, candidate, { headers: this.getAuthHeader() });
    return response.data;
  }

  async updateCandidate(id: number, candidate: CreateCandidateDto): Promise<Candidate> {
    const response = await axios.put(`${API_URL}${id}`, candidate, { headers: this.getAuthHeader() });
    return response.data;
  }

  async deleteCandidate(id: number): Promise<void> {
    await axios.delete(`${API_URL}${id}`, { headers: this.getAuthHeader() });
  }

  async searchCandidates(query: string): Promise<Candidate[]> {
    const response = await axios.get(`${API_URL}search?query=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeader()
    });
    return response.data;
  }
}

export default new CandidateService(); 