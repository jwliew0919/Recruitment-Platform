"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const candidate_controller_1 = require("../controllers/candidate.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Apply authentication middleware to all routes
router.use(auth_1.authenticateToken);
// Candidate routes
router.get('/', candidate_controller_1.getAllCandidates);
router.get('/search', candidate_controller_1.searchCandidates);
router.get('/:id', candidate_controller_1.getCandidateById);
router.post('/', candidate_controller_1.createCandidate);
router.put('/:id', candidate_controller_1.updateCandidate);
router.delete('/:id', candidate_controller_1.deleteCandidate);
exports.default = router;
//# sourceMappingURL=candidate.routes.js.map