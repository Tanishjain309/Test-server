import { Router } from 'express'; 

import { verifyToken } from '../middlewares/verifyToken.js';
import { createTask, deleteTask, updateTask } from '../controllers/taskcontrollers/task-crud.js';
const router1 = Router();

router1.post('/:id/task/create',verifyToken, createTask);
router1.put('/task/update/:id',verifyToken, updateTask);
router1.delete('/task/delete/:id',verifyToken, deleteTask);

export default router1;