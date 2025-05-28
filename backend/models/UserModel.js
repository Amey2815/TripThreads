import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        profileImage:{
            type: String,
            default:'',
        },
        trips:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Trip'
            }
        ]

    }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;