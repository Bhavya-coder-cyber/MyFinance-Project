import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not Authenticated",
            },
            {
                status: 401,
            }
        );
    }

    // const userId = user._id can't be used due to the type mismatch of _id hence we use mongoose pipeline code to convert into mongoose object id
    const userId = new mongoose.Types.ObjectId(session.user._id)
    try {
        const res = await UserModel.aggregate([
            { $match: {_id: userId } },
            {$unwind: '$portfolios'},
            {$sort: {'portfolios.purchaseDate': -1}},
            {$group: {
                _id: '$portfolios.Comp_name',
                units: { 
                    $sum: '$portfolios.units'
                },
                buyPrice: {
                    $last: '$portfolios.buyPrice'
                },
                purchaseDate: {
                    $first: '$portfolios.purchaseDate'
                },
            },
        },
        {
            $sort: {
                purchaseDate: -1
            }
        },
        ])

        if(!res || res.length === 0) {
            return Response.json({
                success: false,
                message: "User not bought any stock or User not found",
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: "Portfolios fetched successfully",
            portfolios: res,
        }, {
            status: 200
        })
    } catch (error) {
        console.log("An unexpected error occurred", error)
        return Response.json({
            success: false,
            message: error
        }, {
            status: 500
        })
    }
}