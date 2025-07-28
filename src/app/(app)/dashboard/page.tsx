"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { DrawerDemo } from "@/components/drawerdemo";
import { AlertDialogDemo } from "@/components/alertDialog";
import { PortfolioPieChart } from "@/components/piecharts";

interface PortfolioItem {
  _id?: string;
  Comp_name?: string;
  units: number;
  buyPrice: number;
  purchaseDate: Date;
}

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchPortfolio = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await Axios.get<{ success: boolean; portfolios: PortfolioItem[]; message?: string }>("/api/get-portfolio");
        if (response.data.success) {
          setPortfolio(response.data.portfolios);
          if (refresh) toast.success("Portfolio updated successfully");
        } else {
          toast.error(response.data.message || "Failed to fetch portfolio");
          setPortfolio([]);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        setPortfolio([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchBalance = useCallback(async () => {
  try {
    const resp = await Axios.get("/api/getUserData");
    if (resp.data.success) {
      setBalance(resp.data.data.accBalance);
    } else {
      setBalance(0);
    }
  } catch (error) {
    setBalance(0);
  }
}, []);

  useEffect(() => {
    if (session?.user && typeof session.user.accBalance === "number") {
      fetchBalance();
    } else {
      setBalance(0);
    }
    console.log(balance)
  }, [session]);

  useEffect(() => {
    if (session?.user) fetchPortfolio();
  }, [session, fetchPortfolio]);

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  const userData = session.user;

  return (
    <div className="min-h-screen">
      {/* Balance Section */}
      <div className="flex justify-between mx-10 p-6 rounded-xl shadow-md mb-6">
        <div className="items-center ml-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Account Balance
          </h2>
          <p className="text-3xl font-bold text-green-600">
            ₹ {balance.toLocaleString()}
          </p>
        </div>
        <div className="shadow-md rounded-lg p-5 min-w-1/2">
          <h3 className="text-2xl font-semibold mb-2">{userData.fullname}</h3>
          <p className="text-gray-400 text-lg">Username: {userData.username}</p>
          <p className="text-gray-400 text-lg">Email: {userData.email}</p>
          <p className="text-gray-400 text-lg">Verified: Yes</p>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="p-6 rounded-xl shadow-md mb-6">
        <PortfolioPieChart portfolio={portfolio} />
        <div className="p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Your Portfolio
          </h2>
          {portfolio.length === 0 ? (
            <p className="text-gray-500">No holdings yet. Start investing!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-sm font-semibold text-gray-600 border-b">
                    <th className="py-2 px-4">Stock</th>
                    <th className="py-2 px-4">Units</th>
                    <th className="py-2 px-4">Buy Price</th>
                    <th className="py-2 px-4">Total Value</th>
                    <th className="py-2 px-4">Purchase Date</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => {
                    const stockSymbol = item._id ?? item.Comp_name ?? "N/A";
                    const purchaseDate = new Date(item.purchaseDate);
                    const formattedDate = isNaN(purchaseDate.getTime())
                      ? "N/A"
                      : purchaseDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });

                    return (
                      <tr key={`${stockSymbol}-${item.purchaseDate}`} className="text-sm text-gray-700">
                        <td className="py-2 px-4 font-bold">{stockSymbol}</td>
                        <td className="py-2 px-4">{item.units}</td>
                        <td className="py-2 px-4">₹ {item.buyPrice}</td>
                        <td className="py-2 px-4">₹ {(item.buyPrice * item.units).toLocaleString()}</td>
                        <td className="py-2 px-4">{formattedDate}</td>
                        <td className="py-2 px-4">
                          <DrawerDemo
                            method="Sell"
                            className="mx-2"
                            units={item.units}
                            onSubmit={async (units) => {
                              try {
                                await Axios.post("/api/sell-unit", {
                                  Comp_name: stockSymbol,
                                  units,
                                });
                                await fetchPortfolio(true);
                                await fetchBalance();
                                toast.success("Stock sold successfully");
                              } catch (error) {
                                toast.error("Error selling stock");
                                console.error("Error selling stock:", error);
                              }
                            }}
                          />
                          <AlertDialogDemo
                            Comp_name={stockSymbol}
                            onSell={async () => {
                              await fetchPortfolio(true);
                              await fetchBalance();
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
