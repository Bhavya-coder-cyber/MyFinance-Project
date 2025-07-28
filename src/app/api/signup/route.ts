import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";       
import toast from "react-hot-toast";


export async function POST(request: NextRequest){
    await dbConnect()
    try {
        const reqBody = await request.json()
        const {fullname, username, email, password} = reqBody

        const userVerificationByUsername = await User.findOne({
            username,
            isVerified: true
        })

        if(userVerificationByUsername){
            return NextResponse.json({error: "Username already taken"}, {status: 400})
        }
        const userVerificationByEmail = await User.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(userVerificationByEmail){
            if (userVerificationByEmail.isVerified) {
                return NextResponse.json({error: "Email already taken"}, {status: 400})
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10)
                userVerificationByEmail.password = hashedPassword
                userVerificationByEmail.verifyCode = verifyCode
                userVerificationByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await userVerificationByEmail.save()    
            }
        } else {
            const salt = await bcryptjs.genSalt(10)
            const hashedPassword = await bcryptjs.hash(password, salt)
            
            const expiryDate = new Date()
            expiryDate.setDate(expiryDate.getDate() + 1)
            
            const newUser = new User({
                fullname,
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                forgotPasswordCode: "",
                forgotPasswordCodeExpiry: null,
                isVerified: false,
                accBalance: 10000,
                portfolios: []
            })
            
            await newUser.save()
        }
            
        //send verification email
        const emailRes = await sendVerificationEmail(
            email,
            username, 
            verifyCode
        )
        
        if(!emailRes.success){
            toast.error(emailRes.message)
            return NextResponse.json({error: emailRes.message}, {status: 505})
        }
        return NextResponse.json({
            message: "User created successfully",
            success: true,
        }, {status: 201})

    } catch (error: any) {
        console.error("Error creating user", error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}