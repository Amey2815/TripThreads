import mongoose from "mongoose";


const TripSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        itinerary: [
            {
                day: Number,
                date: String,
                activities: [{
                    time: String,
                    title: String
                }]
            }
        ],
        polls: [
            {
                question: String,
                options: [{ options: String, votes: [mongoose.Schema.Types.ObjectId] }],
                createdBy:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                createdAt:{
                    type: Date,
                    default: Date.now
                }
            }
        ],
        expenses:[
            {
                description: String,
                amount: Number,
                paidBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                splitWith: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }],
                date:{
                    type: Date,
                    default: Date.now
                }
            }
        ],
        inviteCode: {
  type: String,
  unique: true,
  required: true
},
        packingList: [String],
        notes: String,
    }
);

const TripModel = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export default TripModel;