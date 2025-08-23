"use client";
import { useState } from "react";
import TradingViewWidget from "@/components/page";
import axios from "axios";
import { DrawerDemo } from "@/components/drawerdemo";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface StockData {
  symbol: string;
  name: string;
  currency: string;
  price: number | string;
}

interface PortfolioItem {
  _id?: string;
  Comp_name?: string;
  units: number;
  // add other fields if needed
}

const GetStocks = () => {
  const [inputStock, setInputStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState("AAPL");
  const [blank, setBlank] = useState(true);
  const [stockData, setStockData] = useState<StockData>({
    symbol: "",
    name: "",
    currency: "",
    price: "",
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      setBlank(false);

      const symbol = inputStock.trim().toUpperCase();
      const stockName = symbol.split(".")[0];
      if (!stockName) return;

      setStock(symbol);
      setInputStock("");

      const response = await axios.get("/api/getStockData", {
        params: { stock: symbol },
      });
      // console.log(response.data);
      setStockData(response.data);

      const portfolioRes = await axios.get("/api/get-portfolio");
      console.log(portfolioRes.data.portfolios);

      const matching = portfolioRes.data.portfolios.find(
        (item: PortfolioItem) => item._id === stock
      );
      
      console.log(matching?.units);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (units: number) => {
    try {
      if (units <= 0) {
        toast.error("Units must be positive");
        return;
      }
      const response = await axios.post("/api/buy-unit", {
        Comp_name: stock,
        units,
      });
      if (response.data.success) {
        toast.success("Stock bought successfully");
        await handleSearch();
      } else {
        toast.error("Error buying stock - " + response.data.message);
      }
    } catch (error) {
      toast.error("Error buying stock - Insufficient funds");
      console.error("Error buying stock:", error);
    }
  };

  return (
    <div>
      <div className="min-h-screen p-6">
        {/* Search Section */}
        <div className="shadow-md rounded-lg px-5 mb-6">
          <h2 className="text-xl font-semibold mb-3 ">Stock Search</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search for stocks by Symbols (e.g., AAPL, MSFT, RELIANCE.NS, INFY.NS)"
              className="w-full p-3 border rounded-md"
              onChange={(e) => setInputStock(e.target.value.toUpperCase())}
              value={inputStock}
              disabled={loading}
            />
            <button
              className="bg-blue-600 px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Watchlist */}
          <div className="shadow-md rounded-lg p-5">
            <h3 className="text-lg font-semibold mb-2">Stock Info</h3>
            <h4 className="text-2xl font-semibold mb-2">
              {loading ? "Loading..." : stockData.symbol}
            </h4>
            <p className="text-gray-400 text-xl">
              {loading ? "" : stockData.name}
            </p>
            <p className={!loading ? "text-gray-400 text-xl" : "hidden"}>
              {stockData.currency}{" "}
              {typeof stockData.price === "number"
                ? stockData.price.toFixed(2)
                : stockData.price}
            </p>

            {blank ? (
              <p className="text-red-500 font-semibold">
                Please enter the stock symbol
              </p>
            ) : (
              <div className="flex justify-around items-center h-1/2 text-2xl">
                <DrawerDemo
                  method="Buy"
                  className={`bg-blue-600 text-white px-10 py-3 rounded-md hover:bg-blue-700 cursor-pointer text-2xl ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  units={100}
                  onSubmit={handleBuy}
                />
              </div>
            )}
          </div>

          {/* Stock Performance */}
          <div className="shadow-md rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Stock Performance</h3>
            </div>
            <div className="flex items-center justify-center text-gray-400">
              {blank ? (
                <p className="text-red-500 font-semibold">
                  Please enter the stock symbol
                </p>
              ) : (
                <TradingViewWidget Comp_name={stock.split(".")[0]} />
              )}
            </div>
          </div>
        </div>
      </div>
      );
    </div>
  );
};

export default GetStocks;
