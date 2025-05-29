import express from 'express';
import { addExpense, addOrUpdateItineraryDay, addTripMember, createPoll, createTrip , deleteItineraryDay, getPollResult, getTripBalance, getTripById , getUserTrips, joinTripByInviteCode, removeTripMember, voteInPoll } from '../controllers/TripController.js';
import { verifyToken } from '../middleware/authMiddleware.js';


const TripRouter =  express.Router();


TripRouter.post('/create', verifyToken , createTrip);
TripRouter.get('/my-trips',verifyToken , getUserTrips);
TripRouter.get('/:id', verifyToken, getTripById);

// routes/trips.js
TripRouter.post('/join', verifyToken, joinTripByInviteCode);


TripRouter.post('/:id/add-member', verifyToken, addTripMember )
TripRouter.post('/:id/remove-member', verifyToken , removeTripMember )

// add and remove itinerary items
TripRouter.post('/:id/itinerary',verifyToken , addOrUpdateItineraryDay);
TripRouter.delete('/:id/itinerary/:day',verifyToken , deleteItineraryDay);

// expenses split 
TripRouter.post('/:id/expenses',verifyToken,addExpense);
TripRouter.get('/:id/balance',verifyToken, getTripBalance);

// vote for trip
TripRouter.post('/:id/polls',verifyToken,createPoll);
TripRouter.post('/:id/polls/:pollIndex/vote/:optionIndex',verifyToken,voteInPoll);
TripRouter.post('/:id/polls/:pollIndex/results', verifyToken ,getPollResult);

export default TripRouter;