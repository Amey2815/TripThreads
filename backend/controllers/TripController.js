
import TripModel from '../models/TripModel.js';
import UserModel from '../models/UserModel.js';

const generateUniqueInviteCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await TripModel.exists({ inviteCode: code });
  }
  return code;
};

// Create a new trip
export const createTrip = async (req, res) => {
    const { name, destination } = req.body;
    const userId = req.user.id;

    try {
        // ✅ MAKE SURE THIS LINE EXISTS AND IS AWAITED
        const inviteCode = await generateUniqueInviteCode();

        const trip = await TripModel.create({
            name,
            destination,
            createdBy: userId,
            members: [userId],
            inviteCode, // ✅ use generated code here
            itinerary: [],
            polls: [],
            expenses: [],
            packingList: [],
            notes: ''
        });

        await UserModel.findByIdAndUpdate(userId, {
            $push: { trips: trip._id }
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error("Trip creation error:", error);
        res.status(500).json({ message: 'Error creating trip', error: error.message });
    }
};




// join by id 
export const joinTripByInviteCode = async (req, res) =>{
    const { code } = req.params;
    const userId = req.user.id;
    try{
        const trip = await TripModel.findOne({ inviteCode: code });
        if(!trip) return res.status(404).json({message: 'Trip not found'});

        if(trip.members.includes(userId)){
            return res.status(400).json({message: 'You are already a member of this trip'});
        }
        trip.members.push(userId);
        await trip.save();
        await UserModel.findByIdAndUpdate(userId,{ $push: { trips: trip._id } });

        res.status(200).json({message: 'Joined trip successfully', trip});
    }
    catch (error) {
        res.status(500).json({message: 'Error joining trip', error: error.message});
    }
}

// Get all trips for the logged-in user

export const getUserTrips = async (req,res)=>{
    const userId = req.user.id;
    try{
        const user = await UserModel.findById(userId).populate('trips');
        res.status(200).json({ trips: user.trips });
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


// create a poll for the trip

export const createPoll = async (req,res) =>{
    const {id} = req.params;
    const { question, options } = req.body;
    const userId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if(!trip) return res.status(404).json({message: 'Trip not found'});

        if(!trip.members.includes(userId))
            return res.status(403).json({message: 'Only members can create polls'});

        const newPoll = {
            question,
            options: options.map(option => ({text: option , votes : []})),
            createdBy: userId,
        }

        trip.polls.push(newPoll);
        await trip.save();

        res.status(201).json({message: "poll created" ,  polls : trip.polls});
    }
    catch(error){
        res.status(500).json({message: 'Error creating poll', error: error.message});
    }
}


// vote for poll 

export const voteInPoll = async (req,res)=>{
    const {id , pollIndex , optionIndex } = req.params;
    const userId = req.user.id;

    try{
        const trip = await TripModel.findById(id);
        if(!trip) return res.status(404).json({message: 'Trip not found'});

        const poll = trip.polls[pollIndex];
        if(!poll) return res.status(404).json({message: 'Poll not found'});

        for (let option of poll.options) {
            if(option.votes.includes(userId)){
                return res.status(400).json({message: 'User has already voted for this option'});
            }
        }

        poll.option[optionIndex].votes.push(userId);
        await trip.save();

        res.status(200).json({message: "  vote recorded " , poll });
    }
    catch(error){
        res.status(500).json({error: error.message});
    }

}

// view votes

export const getPollResult = async (req,res)=>{
    const {id , pollIndex} = req.params;

    try{
        const trip = await TripModel.findById(id).populate('polls.options.votes')
        if(!trip) return res.status(404).json({message: 'Trip not found'});

        const poll = trip.polls[pollIndex];
        if(!poll) return res.status(404).json({message: 'Poll not found'});

        const result = poll.options.map(option => ({
            text: option.text ,
            votes: option.votes.length ,
        }));

        res.status(200).json({question:poll.question, result});
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
}