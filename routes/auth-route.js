import { Router } from 'express'; // Import Router from express
import { register, login, logout } from '../controllers/authcontrollers/auth.js'; // Make sure to include .js extension
import { validate, validateUser } from '../middlewares/userData-validation.js'; // Make sure to include .js extension

const router = Router(); // Create a new router instance

// Define routes
router.post('/register', validateUser, validate, register);
router.post('/login', login);
router.post("/logout", logout);
// Export the router
export default router;