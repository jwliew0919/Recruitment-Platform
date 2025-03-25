import express, { Router, RequestHandler } from 'express';
import {
  getAllCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  searchCandidates
} from '../controllers/candidate.controller';
import { authenticateToken } from '../middleware/auth';

const router: Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken as RequestHandler);

// Candidate routes
router.get('/', getAllCandidates as RequestHandler);
router.get('/search', searchCandidates as RequestHandler);
router.get('/:id', getCandidateById as RequestHandler);
router.post('/', createCandidate as RequestHandler);
router.put('/:id', updateCandidate as RequestHandler);
router.delete('/:id', deleteCandidate as RequestHandler);

export default router; 