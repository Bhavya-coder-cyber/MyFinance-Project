import mongoose, { Schema, Document } from "mongoose";

export interface Portfolio extends Document {
  Comp_name: string;
  units: number;
  buyPrice: number;
  purchaseDate: Date;
}

const PortfolioSchema: Schema<Portfolio> = new Schema({
  Comp_name: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
    min: 0,
  },
  buyPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  purchaseDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


export interface User extends Document {
  fullname: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  forgotPasswordCode: string;
  forgotPasswordCodeExpiry: Date;
  isVerified: boolean;
  accBalance: number;
  portfolios: Portfolio[];
}

const UserSchema: Schema<User> = new Schema({
  fullname: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verification code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  forgotPasswordCode: String,
  forgotPasswordCodeExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  accBalance: {
    type: Number,
    default: 10000,
  },
  portfolios: [PortfolioSchema]
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel