import mongoose from "mongoose";
import Joi from 'joi'
import { join } from "path";
import { v4 as uuidv4 } from 'uuid';

//utiliser schema et model du module mongoose
const {Schema,model} = mongoose;

const userSchema=new Schema(
    {   UserId:{
        type: String,
        default: uuidv4,
        unique: true
      },
        username:{
            type:String,
            required:true //cet attribut est obligatoire
        },

        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
       
        score: {
            type: Number,
            default: 0,
        },
        coins: {
            type: Number,
            default: 0,
        },
        
        
        
    },

    {
        timestamps:true //ajouter auto createdAt et updatedAt
    }
);

export function userValidate(user){
    const schema = Joi.object({
        UserId: Joi.string().min(4).max(30).required(),
        username: Joi.string().min(4).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
        
    });

    return schema.validate(user);
}

export function loginValidate(user){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(user);
}


export default model("User",userSchema);