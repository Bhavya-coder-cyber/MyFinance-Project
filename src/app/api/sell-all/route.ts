import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Portfolio } from "@/models/User";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

const sellAllStockSchema = z.object({
  Comp_name: z.string().min(1, "Stock symbol is required"),
});
export async function POST(request: Request) {
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
  try {
    const data = await request.json();

    const queryParam = {
      Comp_name: data.Comp_name,
    };

    //validate with zod
    const result = sellAllStockSchema.safeParse(queryParam);
    if (!result.success) {
      const Comp_nameErrors = result.error.format().Comp_name?._errors || [];
      return Response.json(
        {
          success: false,
          message: Comp_nameErrors.length > 0 ? Comp_nameErrors.join(", ") : "",
        },
        {
          status: 400,
        }
      );
    }
    const { Comp_name } = result.data;
    const stock = Comp_name?.toUpperCase().trim();
    const dbUser = await UserModel.findOne({ username: session.user.username });

    if (!dbUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const portfolio = dbUser.portfolios.find((p) => p.Comp_name === stock);

    
    if (!portfolio) {
      return Response.json(
        { success: false, message: "Insufficient units to sell" },
        { status: 400 }
      );
    }
    const allUnits = portfolio.units
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}`;

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch data",
        },
        {
          status: 500,
        }
      );
    }

    const stockData = await response.json();

    if (!stockData.chart?.result?.[0]?.meta?.regularMarketPrice) throw new Error("Invalid stock data");

    let price: number = stockData.chart.result[0].meta.regularMarketPrice;
    const currency = stockData.chart.result[0].meta.currency;
    const totalUnits = allUnits;

    if (currency === "USD") {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGER_API_KEY}/latest/USD`
      );
      const data = await res.json();
      const rate = data.conversion_rates.INR;
      price *= rate;
    }
    dbUser.accBalance += price * totalUnits;

    dbUser.portfolios = dbUser.portfolios.filter(p => p.Comp_name !== stock);
    await dbUser.save();

    return Response.json(
      {
        success: true,
        message: `Sold all ${totalUnits} units of ${stock} at ₹${price.toFixed(2)} each.`,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in buying units", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
