import User, { loginValidate, userValidate } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import { Error, model } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from 'ejs';
import sendConfirmationEmail from "../middlewares/mailer.js";
import crypto from 'crypto';
import moment from 'moment';
import schedule from 'node-schedule';
import dotenv from 'dotenv';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


export async function getAll(req, res) {
    try {
        const users = await User
            .find({}).lean();
        console.log(users);
        res.status(200).json({users});
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export async function getAllusr(req, res) {
    res.send({users: await User.find()})
}
export async function profile(req, res) {
    try {
        const { _id } = req.user;
        const connectedUser = await User.findById(_id).lean();
        res.status(200).json(connectedUser);
    } catch (err) {
        res.status(401).json({ "message": "authentication problem" })
    }

}


// register
export async function register(req, res) {
    const { error } = userValidate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user;
    try {
        user = await User.findOne({ email: req.body.email });
    } catch (err) {
        return res.status(500).send('An error occurred while searching for the user.');
    }

    if (user) {
        return res.status(404).send('Email already exists');
    }


    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const { UserId,username, email } = req.body
    await User
        .create({
            UserId,
            username,
            email,
            password: hashedPassword,
            score: 0,
            coins: 0,
           
        })
        .then(docs => {
            res.status(200).json({ message: 'User Added Successfully!', 
        });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
   
}


//login

// Login
export async function login(req, res) {
    try {
        const { error } = loginValidate(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('Invalid email or password');
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(404).send('Invalid email or password');
        }

        // Generate a JSON Web Token (JWT) for user authentication
        const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h', // You can adjust the token expiration time as needed
        });

        res.status(200).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}


//Recherche d’un seul document
export async function getOnce(req, res) {

    await User
        .findById(req.params.id)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

export async function patchOnce(req, res) {

    await User
        //findByIdAndUpdate si vous voulez modifier un document à l’aide de son ID.
        .findByIdAndUpdate(req.params.id, req.body)
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

}

export async function deleteOnce(req, res) {
    try {
        let checkIfUserExists = await User.findById(req.params.id);
        if (!checkIfUserExists) throw new Error();
        const user = await User
            .findByIdAndRemove(req.params.id)
        res.status(200).json({ "message": user });
    } catch (err) {
        res.status(404).json({ message: "user not found" });
    }

}

//forgot password











export async function updateUserbyuserId(req, res) {
    const { UserId } = req.params;
    const { username, email, password, score,coins} = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { UserId: UserId }, // Find the user by UserId
        {$set:{username, email, password, score,coins}}, // Update the user's information
        { new: true } // Return the updated user
      );
  
      if (!user) {
        throw new Error(`User with public key  ${UserId} not found`);
      }
  
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  }
  
  export async function getUserbyUserId(req, res) {
    try {
        const {UserId} = req.params;
        const user = await User.findOne({UserId}).populate('username').populate('email').populate('score').populate('coins');
    
        if (!user) {
          return res.status(404).json({message: `User with id ${UserId} not found`});
        }
    
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({message: error.message});
      }
    
  }
 
 
  
  
  
  
  
  
  
  

