import { Router } from 'express';
import { register } from '../controllers/registrationController.js';
import { authenticate } from '../middleware/auth.js'; // confirm name/path with Dev 3

const router = Router();

// [REG-BE-02]
router.post('/registrations', authenticate, register);

export default router;