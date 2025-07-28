import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

const incrementBalanceSchema = z.object({
    amount: z.number().int().positive("Amount must be positive"),
});

export async function POST(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

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

  const userId = user._id;
  try {
    const data = await req.json();

    const queryParam = {
      amount: data.amount,
    };

    //validate with zod
    const result = incrementBalanceSchema.safeParse(queryParam);
    if (!result.success) {
      const amountErrors = result.error.format().amount?._errors || [];
      return Response.json(
        { success: false, message: amountErrors?.length > 0 ? amountErrors.join(", ") : "Invalid amount" },
        { status: 400 }
      );
    }

    const { amount } = result.data;
    const dbUser = await UserModel.findById(userId);

    if (!dbUser) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    dbUser.accBalance += amount;
    await dbUser.save();

    return Response.json({ success: true,
      message: "Balance incremented successfully", data: dbUser }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}