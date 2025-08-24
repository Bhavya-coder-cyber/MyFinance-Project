"use client"
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { ModeToggle } from './darkmode'

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user as User
  return (
    <nav className="flex items-center justify-around p-5 bg-black dark:bg-black">
        <div>
          <Link href='/' className="text-3xl font-bold font-serif italic text-white dark:text-white">
            MyFinance
          </Link>
          {
                session ? (
                    <>
                    <span className="text-md flex justify-between font-lemon text-white dark:text-white">Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto cursor-pointer' onClick={() => signOut()} variant="default">Logout</Button>
                    </>
                ) : (
                    <>
                    <Link href="/login">
                        <Button className='w-full md:w-auto cursor-pointer' variant="default">Login</Button>
                    </Link>
                    </>
                )
            }
        </div>
        <hr />
        <div className="flex items-center justify-between gap-10">
          <p className="flex justify-between p-2 rounded-lg font-serif cursor-pointer text-white dark:text-white">
            <Link href="/dashboard">
              <Button variant="ghost" className='cursor-pointer text-xl'>DashBoard</Button>
            </Link>
          </p>
          <p className="flex justify-between p-2 rounded-lg font-serif cursor-pointer text-white dark:text-white">
            <Link href="/pumpBalance">
              <Button variant="ghost" className='cursor-pointer text-xl'>Wallet</Button>
            </Link>
          </p>
          <p className="flex justify-between p-2 rounded-lg font-serif cursor-pointer text-white dark:text-white">
            <Link href="/getStocks">
              <Button variant="ghost" className='cursor-pointer text-xl'>Stocks</Button>
            </Link>
          </p>
          <p className="flex justify-between p-2 rounded-lg font-serif cursor-pointer text-white dark:text-white">
            <Link href="/getCrypto">
              <Button variant="ghost" className='cursor-pointer text-xl'>Crypto</Button>
            </Link>
          </p>
        </div>
        <div className="flex items-center">
          <div className="text-black dark:text-white">
            <ModeToggle />
          </div>
        </div>
      </nav>
  )
}

export default Navbar
