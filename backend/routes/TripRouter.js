import express from 'express';
import { createTrip , getTripById , getUserTrips } from '../controllers/TripController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const TripRouter =  express.Router();


TripRouter.post('/create', verifyToken , createTrip);
TripRouter.get('/my-trips',verifyToken , getUserTrips);
TripRouter.get('/:id', verifyToken, getTripById);

export default TripRouter;