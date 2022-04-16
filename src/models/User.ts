import mongoose from "mongoose";
import validator from 'validator';

interface IUser {
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
}

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide proper email'
        },
        required: [true, 'Please provide email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    }
})

export default mongoose.model('User', UserSchema);