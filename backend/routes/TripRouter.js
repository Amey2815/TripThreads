import express from 'express';
import { addExpense, addOrUpdateItineraryDay, addTripMember, createTrip , deleteItineraryDay, getTripBalance, getTripById , getUserTrips, removeTripMember } from '../controllers/TripController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const TripRouter =  express.Router();


TripRouter.post('/create', verifyToken , createTrip);
TripRouter.get('/my-trips',verifyToken , getUserTrips);
TripRouter.get('/:id', verifyToken, getTripById);

TripRouter.post('/:id/add-member', verifyToken, addTripMember )
TripRouter.post('/:id/remove-member', verifyToken , removeTripMember )

// add and remove itinerary items
TripRouter.post('/:id/itinerary',verifyToken , addOrUpdateItineraryDay);
TripRouter.delete('/:id/itinerary/:day',verifyToken , deleteItineraryDay);

// expenses split 
TripRouter.post('/:id/expenses',verifyToken,addExpense);
TripRouter.get('/:id/balance',verifyToken, getTripBalance);

export default TripRouter;