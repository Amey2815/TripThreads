import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const existingUser = await UserModel.findOne({ email});
        if(existingUser) return res.status(400).json({ message: 'User already exists' });

        const harshedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel({
            name,
            email,
            password: harshedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

export const loginUser = async (req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await UserModel.findOne({email});
        if(!user) return res.status(400).json({ message: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET, { expiresIn: '6h' });
        res.status(200).json({
            token,
            message: 'User logged in successfully',
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}