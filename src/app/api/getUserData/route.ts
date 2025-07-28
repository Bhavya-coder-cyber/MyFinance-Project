import dbConnect from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function GET(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);
    return NextResponse.json({
        success: true,
        data: foundUser
    }, { status: 200 });
}