import mongoose, { Types, Document } from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
    _id: Types.ObjectId
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

UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.comparePassword = async function (candidatePassword: (typeof this.password)) {
    const isPasswordCorrect = await bcrypt.compare(candidatePassword, this.password);
    return isPasswordCorrect;
}

export default mongoose.model('User', UserSchema);