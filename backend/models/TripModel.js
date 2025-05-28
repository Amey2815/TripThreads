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
                date: Date,
                activities: [{
                    time: String,
                    title: String,
                    notes: String
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
                title: String,
                amount: Number,
                paidBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                splitWith: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }]
            }
        ],
        packingList: [String],
        notes: String
    }
);

const TripModel = mongoose.models.Trip || mongoose.model('Trip', TripSchema);
export default TripModel;