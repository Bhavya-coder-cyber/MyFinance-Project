"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

const PumpBalance = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [withdraw, setWithdraw] = useState(0);

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

  const incrementBalance = async (amount: number) => {
    try {
        console.log(amount);
        const resp = await Axios.post("/api/incrementBalance", {amount});
        if (resp.data.success) {
            fetchBalance();
            toast.success("Balance incremented " + amount.toLocaleString());
        } else {
            toast.error(resp.data.message);
        }
        
    } catch (error) {
        toast.error("Error incrementing balance");
        console.error("Error incrementing balance:", error); 
    }
  }

  const WithdrawMoney = async (amount: number) => {
    try {
        console.log(amount);
        const resp = await Axios.post("/api/withdraw", {amount});
        if (resp.data.success) {
            fetchBalance();
            toast.success("Amount withdrawn " + amount.toLocaleString());
        }
        
    } catch (error) {
        toast.error("Insufficient funds");
        console.error("Error decrementing balance:", error); 
    }
  }

  useEffect(() => {
    if (session?.user && typeof session.user.accBalance === "number") {
      fetchBalance();
    } else {
      setBalance(0);
    }
    console.log(balance)
  }, [session]);

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

  return (
    <div className="min-h-screen">
      {/* Balance Section */}
      <div className="flex justify-center p-6 rounded-xl shadow-md mb-6">
        <div className="items-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Account Balance
          </h2>
          <p className="text-6xl font-bold text-green-600">
            ₹ {balance.toLocaleString()}
          </p>
        </div>
      </div>
        <div className="flex justify-center p-6 rounded-xl shadow-md mb-6 gap-10">
            <Button variant="secondary" className="cursor-pointer" onClick={() => incrementBalance(10000)}>₹10,000</Button>
            <Button variant="secondary" className="cursor-pointer" onClick={() => incrementBalance(100000)}>₹100,000</Button>
            <Button variant="secondary" className="cursor-pointer" onClick={() => incrementBalance(1000000)}>₹1,000,000</Button>
        </div>
        <div className="flex justify-center p-6 rounded-xl shadow-md mb-6 gap-2">
            <input type="text" className="border border-gray-300 rounded-md px-2 py-1" placeholder="0" onChange={(e) => setWithdraw(parseInt(e.target.value))}/>
            <Button variant="default" className="cursor-pointer" onClick={() => WithdrawMoney(withdraw)}>Withdraw</Button>
        </div>

    </div>
  );
};

export default PumpBalance;
