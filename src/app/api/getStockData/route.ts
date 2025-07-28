
import z from "zod";
// import { NextResponse } from "next/server";

const StockQuerySchema = z.object({
  stock: z.string(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      stock: searchParams.get("stock"),
    };

    //validate with zod
    const result = StockQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const stockErrors = result.error.format().stock?._errors || [];
      return Response.json({ success: false, message: stockErrors?.length > 0 ? stockErrors.join(", ") : "Invalid stock" }, { status: 400 });
    }
    const { stock } = result.data; 
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${stock.toUpperCase()}`;

    const response = await fetch(url);

    if (!response.ok) {
      return Response.json(
        { success: false, message: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const symbol = data?.chart?.result?.[0]?.meta?.symbol;
    const name = data?.chart?.result?.[0]?.meta?.shortName;
    const currency = data?.chart?.result?.[0]?.meta?.currency;
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    
    return Response.json({success: true, symbol, name, currency, price}, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return Response.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
