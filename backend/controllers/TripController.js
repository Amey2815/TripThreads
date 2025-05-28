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


// add a member to a trip

export const addTripMember = async (req,res)=>{
    const {id} = req.params;
    const {userIdOrEmail} = req.body;
    const requesterId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }

        if(trip.createdBy.toString() !== requesterId){
            return res.status(403).json({message: 'Only the trip creator can add members'});
        }

        const user = await UserModel.findOne({
            $or: [
                { _id: userIdOrEmail },
                { email: userIdOrEmail }
            ]
        });

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        if (trip.members.includes(user._id)) {
            return res.status(400).json({message: 'User is already a member of this trip'});
        }
        trip.members.push(user._id);
        await trip.save();

        user.trips.push(trip._id);
        await user.save();

        res.status(200).json({message: 'User added to trip', trip});
    }
    catch(error){
        res.status(500).json({message: 'Error adding member', error: error.message});
    }
}


// Remove a member from a trip
export const removeTripMember = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const requesterId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }

        if (trip.createdBy.toString() !== requesterId) {
            return res.status(403).json({message: 'Only the trip creator can remove members'});
        }

        if (!trip.members.includes(userId)) {
            return res.status(400).json({message: 'User is not a member of this trip'});
        }

        trip.members = trip.members.filter(member => member.toString() !== userId);
        await trip.save();

       await UserModel.findByIdAndUpdate(userId, {
            $pull: { trips: trip._id }
        });

        res.status(200).json({message: 'User removed from trip'});
    }
    catch (error) {
        res.status(500).json({message: 'Error removing member', error: error.message});
    }
}

// add or update trip itinerary
export const addOrUpdateItineraryDay = async (req,res) => {
    const { id } = req.params;
    const { day, date, activities } = req.body;
    const userId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }

        if(!trip.members.includes(userId)){
            return res.status(403).json({message: 'You are not a member of this trip'});
        }

        const existingDay = trip.itinerary.find(d => d.day === day);
        if (existingDay) {
            existingDay.date = date;
            existingDay.activities = activities;
        }
        else {
            trip.itinerary.push({ day, date, activities });
        }

        await trip.save();
        res.status(200).json({message: 'Itinerary updated successfully', itinerary: trip.itinerary});
    }
    catch (error) {
        res.status(500).json({message: 'Error updating itinerary', error: error.message});
    }
}


// delete itinerary day
export const deleteItineraryDay = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;
    try{
        const trip = await TripModel.findById(id);
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }

        if (!trip.members.includes(userId)) {
            return res.status(403).json({message: 'You are not a member of this trip'});
        }

        trip.itinerary = trip.itinerary.filter(d => d.day !== parseInt(day));
        await trip.save();
        res.status(200).json({message: 'Itinerary day deleted successfully', itinerary: trip.itinerary});

    }
    catch (error) {
        res.status(500).json({message: 'Error deleting itinerary day', error: error.message});
    }
}


// add expense to trip
export const addExpense = async (req, res) => {
    const {id} = req.params;
    const { description , amount , paidBy , splitWith } = req.body;
    const userId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if (!trip) {
            return res.status(404).json({message: 'Trip not found'});
        }

        if (!trip.members.includes(userId)) {
            return res.status(403).json({message: 'You are not a member of this trip'});
        }

        trip.expenses.push({
            description,
            amount,
            paidBy,
            splitWith,
        });

        await trip.save();
        res.status(201).json({message: "expense added " ,  expenses: trip.expenses});
    }
    catch(error){
        res.status(500).json({message: 'Error adding expense', error: error.message});
    }
}

// slit expense among members
export const getTripBalance = async (req,res)=>{
    const {id}= req.params;
    try{
        const trip = await TripModel.findById(id).populate('expenses.paidBy expenses.splitWith');
        if (!trip) return res.status(404).json({message: 'Trip not found'});

        const balance = {};

        trip.members.forEach(member => {
            balance[member.toString()] = 0;
        });

        for (let expense of trip.expenses){
            const share = expense.amount / expense.splitWith.length;

            for  (let user of expense.splitWith) {
                balance[user.toString()] -= share;
            }

            balance[expense.paidBy.toString()] += expense.amount;
        }

        res.status(200).json({balance});
    }
    catch (error) {
        res.status(500).json({message: 'Error fetching trip balance', error: error.message});
    }
}