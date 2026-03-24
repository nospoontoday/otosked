import express from 'express';
import * as controller from '../controllers/projectController.js';
const router = express.Router();

router.get('/', controller.index);
router.post('/', controller.store);

export default router;