import { Request, Response } from 'express';
import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Candidate extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  phone?: string;
  skills?: string;
  experience_years?: number;
  location?: string;
  availability?: boolean;
  created_at: Date;
}

export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const [candidates] = await pool.query<Candidate[]>(
      'SELECT * FROM candidates ORDER BY created_at DESC'
    );
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [candidates] = await pool.query<Candidate[]>(
      'SELECT * FROM candidates WHERE id = ?',
      [id]
    );

    if (!candidates[0]) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidates[0]);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      skills,
      experience_years,
      location,
      availability
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO candidates (name, email, phone, skills, experience_years, location, availability) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, skills, experience_years, location, availability]
    );

    const [newCandidate] = await pool.query<Candidate[]>(
      'SELECT * FROM candidates WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newCandidate[0]);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      skills,
      experience_years,
      location,
      availability
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE candidates SET name = ?, email = ?, phone = ?, skills = ?, experience_years = ?, location = ?, availability = ? WHERE id = ?',
      [name, email, phone, skills, experience_years, location, availability, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const [updatedCandidate] = await pool.query<Candidate[]>(
      'SELECT * FROM candidates WHERE id = ?',
      [id]
    );

    res.json(updatedCandidate[0]);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM candidates WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchCandidates = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchTerm = `%${query}%`;
    const [candidates] = await pool.query<Candidate[]>(
      'SELECT * FROM candidates WHERE name LIKE ? OR email LIKE ? OR skills LIKE ?',
      [searchTerm, searchTerm, searchTerm]
    );

    res.json(candidates);
  } catch (error) {
    console.error('Error searching candidates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 