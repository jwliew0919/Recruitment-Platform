"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCandidates = exports.deleteCandidate = exports.updateCandidate = exports.createCandidate = exports.getCandidateById = exports.getAllCandidates = void 0;
const db_1 = require("../config/db");
const getAllCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [candidates] = yield db_1.pool.query('SELECT * FROM candidates ORDER BY created_at DESC');
        res.json(candidates);
    }
    catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllCandidates = getAllCandidates;
const getCandidateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [candidates] = yield db_1.pool.query('SELECT * FROM candidates WHERE id = ?', [id]);
        if (!candidates[0]) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidates[0]);
    }
    catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getCandidateById = getCandidateById;
const createCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, skills, experience_years, location, availability } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        const [result] = yield db_1.pool.query('INSERT INTO candidates (name, email, phone, skills, experience_years, location, availability) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, email, phone, skills, experience_years, location, availability]);
        const [newCandidate] = yield db_1.pool.query('SELECT * FROM candidates WHERE id = ?', [result.insertId]);
        res.status(201).json(newCandidate[0]);
    }
    catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createCandidate = createCandidate;
const updateCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, phone, skills, experience_years, location, availability } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        const [result] = yield db_1.pool.query('UPDATE candidates SET name = ?, email = ?, phone = ?, skills = ?, experience_years = ?, location = ?, availability = ? WHERE id = ?', [name, email, phone, skills, experience_years, location, availability, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        const [updatedCandidate] = yield db_1.pool.query('SELECT * FROM candidates WHERE id = ?', [id]);
        res.json(updatedCandidate[0]);
    }
    catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateCandidate = updateCandidate;
const deleteCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.pool.query('DELETE FROM candidates WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json({ message: 'Candidate deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteCandidate = deleteCandidate;
const searchCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const searchTerm = `%${query}%`;
        const [candidates] = yield db_1.pool.query('SELECT * FROM candidates WHERE name LIKE ? OR email LIKE ? OR skills LIKE ?', [searchTerm, searchTerm, searchTerm]);
        res.json(candidates);
    }
    catch (error) {
        console.error('Error searching candidates:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.searchCandidates = searchCandidates;
//# sourceMappingURL=candidate.controller.js.map