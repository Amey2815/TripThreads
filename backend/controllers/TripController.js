import TripModel from '../models/TripModel.js';
import UserModel from '../models/UserModel.js';


// Create a new trip
export const createTrip = async (req, res) =>{
    const {name,destination} = req.body;
    const userId = req.user.id;
    try{
        const trip = await TripModel.create({
            name,
            destination,
            createdBy: userId,
            members: [userId],
            itinerary:[],
            polls:[],
            expenses:[],
            packingList : [],
            notes: ''
        })

        await UserModel.findByIdAndUpdate(userId,{
            $push: { trips: trip._id }
        });
        res.status(201).json(trip);
    }
    catch (error) {
        res.status(500).json({message: 'Error creating trip', error: error.message});
    }
}

// Get all trips for the logged-in user

export const getUserTrips = async (req,res)=>{
    const userId = req.user.id;
    try{
        const user = await UserModel.findById(userId).populate('trips');
        res.status(200).json(user.trips);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching trips', error: error.message});
    }
}


// Get a specific trip by ID
export const getTripById = async (req,res)=>{
    const { id } = req.params;

    try{
        const trip = await TripModel.findById(id).populate('members');
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }
        res.status(200).json(trip);
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching trip', error: error.message});
    }
}