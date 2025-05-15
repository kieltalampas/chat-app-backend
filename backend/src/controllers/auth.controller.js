import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../lib/utils.js';

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }
        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }

        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message: 'User already exists'});
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, 
            email,
            password: hashedPassword
        })

        if(newUser) {
            //generate jwt token
            generateToken(newUser._id, res);
            await newUser.save(); //save user to db

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })

        }else{
            return res.status(400).json({message: 'User not created'});
        }

    }catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}

export const login = (req, res) => {
    res.send('login up page');
}

export const logout = (req, res) => {
    res.send('logout up page');
}