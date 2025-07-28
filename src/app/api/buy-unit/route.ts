import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Portfolio } from "@/models/User";
import z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

const buyStockSchema = z.object({
  Comp_name: z.string().min(1, "Stock symbol is required"),
  units: z.number().int().positive("Units must be positive")
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
    const data = await request.json()

    console.log(data)
    
    // console.log(request.body);
    const queryParam = {
      Comp_name: data.Comp_name,
      units: data.units
    };
    console.log(queryParam);

    //validate with zod
    const result = buyStockSchema.safeParse(queryParam);
    if (!result.success) {
      const Comp_nameErrors = result.error.format().Comp_name?._errors || [];
      console.log(Comp_nameErrors);
      return Response.json(
        {
          success: false,
          message: Comp_nameErrors.length > 0 ? Comp_nameErrors.join(", ") : "",
        },
        {
          status: 405,
        }
      );
    }
    const { Comp_name, units } = result.data;
    const stock = Comp_name?.toUpperCase().trim();
    console.log(stock);
    
    if (!stock) {
      return Response.json(
        {
          success: false,
          message: "Invalid stock",
        },
        {
          status: 407,
        }
      )
    }
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
    const existingPortfolio = dbUser.portfolios.find(
      p => p.Comp_name === stock
    );

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock}`;
    console.log(url);

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          message: "Failed to fetch data",
        },
        {
          status: 410,
        }
      );
    }

    const stockData = await response.json();

    let price = stockData.chart.result[0].meta.regularMarketPrice;
    console.log(price);
    const currency = stockData.chart.result[0].meta.currency;
    const totalUnits: number = units

    if (currency === "USD") {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGER_API_KEY}/latest/USD`
      );
      const data = await res.json();
      const rate = data.conversion_rates.INR;
      price *= rate;
    }
    
    const totalPrice = price * totalUnits;
    if (dbUser.accBalance < totalPrice) {
      return Response.json(
        {
          success: false,
          message: "Insufficient balance",
        },
        {
          status: 410,
        }
      );
    }

    dbUser.accBalance -= price * totalUnits;

    if (existingPortfolio) {
      existingPortfolio.units += totalUnits;
      existingPortfolio.buyPrice = price;
      existingPortfolio.purchaseDate = new Date();
    } else {
      const newPortfolio = {
        Comp_name: stock,
        units: totalUnits,
        buyPrice: price,
        purchaseDate: new Date(),
      };
  
      dbUser.portfolios.push(newPortfolio as Portfolio);
    }

    await dbUser.save();

    return Response.json({
        success: true,
        message: "Unit bought successfully"
    }, {
        status: 200
    })
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
