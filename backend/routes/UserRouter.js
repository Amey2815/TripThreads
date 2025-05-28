import express from 'express';
import { registerUser , loginUser } from '../controllers/UserController.js';


const UserRouter = express.Router();

// Register route
UserRouter.post('/register', registerUser);
// Login route
UserRouter.post('/login', loginUser);

export default UserRouter;