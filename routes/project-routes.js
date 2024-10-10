import { Router } from 'express'; 
import { createProject, deleteProject, getIndividualProjectDetails, 
    getProject, updateProject } from '../controllers/projectcontrollers/project-crud.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const router1 = Router();

router1.post('/create',verifyToken, createProject);
router1.get("/myProjects",verifyToken, getProject);
router1.get('/myProjects/:id',verifyToken, getIndividualProjectDetails);
router1.put('/update/:id', verifyToken, updateProject);
router1.delete('/delete/:id', verifyToken, deleteProject);

export default router1;