"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const router = express_1.default.Router();
// Auth routes
router.post('/login', auth_controller_1.login);
router.post('/register', auth_controller_1.register);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map