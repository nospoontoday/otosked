import express from 'express';
import * as controller from '../controllers/projectController.js';

const router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.store);
router.put('/:id', controller.update);

export default router;