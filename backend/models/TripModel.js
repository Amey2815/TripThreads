import mongoose from "mongoose";


const TripSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
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
                options: [{ options: String, votes: [mongoose.Schema.Types.ObjectId] }]
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
        packingList: [String],
        notes: String
    }
);

const TripModel = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export default TripModel;