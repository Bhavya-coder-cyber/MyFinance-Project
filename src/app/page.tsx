"use client";
import React from "react";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import Link from "next/link";
import { ModeToggle } from "@/components/darkmode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import features from "@/features.json";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="flex justify-center relative">
        <div className="absolute top-0 left-0 w-full h-[75vh] -z-10">
          <img
            src="https://i.pinimg.com/736x/f8/6a/82/f86a825479ac98f0b1040ea80f0b5ec5.jpg"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>
        <div className="min-h-screen w-4/5">
          {/* Sticky Navbar */}
          <nav className="sticky top-0 z-50 shadow-md py-4 px-10 flex items-center justify-between text-xl transition-all duration-500 bg-gray-950 rounded-2xl">
            {/* MyFinance Logo Title */}
            <div
              className={`transition-all duration-700 ease-in-out text-2xl font-bold italic font-serif text-white dark:text-white ${
                scrolled
                  ? "translate-x-0 opacity-100"
                  : "translate-x-[50%] opacity-0 absolute left-1/2"
              }`}
            >
              MyFinance
            </div>

            {/* Right-side Nav Links */}
            <div className="flex gap-7 w-screen justify-end">
              <Link href="/login" className=" text-white dark:text-white">
                Login
              </Link>
              <Link href="/signup" className=" text-white dark:text-white">
                Register
              </Link>
              <Link href="/learn" className=" text-white dark:text-white">
                Learn
              </Link>
              <Link href="/news" className=" text-white dark:text-white">
                News
              </Link>
              <ModeToggle />
            </div>
          </nav>

          {/* Centered Heading initially */}
          {!scrolled && (
            <div className="font-normal flex flex-col justify-center items-center gap-2 mt-20 transition-opacity duration-500 m-5 text-white dark:text-white">
              <div>
                <h1 className="text-4xl">
                  Welcome to{" "}
                  <span className="font-bold italic font-serif ml-2 text-white dark:text-white">
                    MyFinance
                  </span>
                </h1>
              </div>
              <div className="m-5">
                <h2 className="text-2xl">
                  Your Money, Your Moves, Made Smarter.
                </h2>
              </div>
            </div>
          )}

          {/* Dummy Scrollable Content */}
          <div className="h-[550px] flex flex-col justify-center items-center text-gray-500 m-10">
            <h1 className="text-2xl">
              Online platform to invest in stocks, derivatives, mutual funds,
              ETFs, bonds, and more.
            </h1>
            <Link href="/signup">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-5 text-2xl cursor-pointer">
                Get Started for Free
              </button>
            </Link>
          </div>
          <div className="flex justify-around w-full mb-5">
            <div className="max-w-1/2">
              <h1
                className={`transition-all duration-700 ease-in-out text-3xl font-bold italic font-serif text-black dark:text-white ${
                  scrolled
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[50%] opacity-0 absolute left-1/2"
                }`}
              >
                About
              </h1>
              <div
                className={`transition-all duration-1200 ease-in-out text-2xl font-serif text-gray-500 dark:text-white ${
                  scrolled
                    ? "translate-x-0 opacity-100"
                    : "translate-x-[50%] opacity-0 absolute left-1/2"
                }`}
              >
                <p className="my-5">
                  MyFinance is an online platform that allows users to invest in
                  stocks, derivatives, mutual funds, ETFs, bonds, and other
                  financial products.
                </p>
                <p className="mb-5">
                  With a user-friendly interface and a commitment to
                  transparency, MyFinance makes it easy for investors to make
                  informed decisions about their investments.
                </p>
                <p>
                  Whether you&apos;re a seasoned investor or a beginner, MyFinance
                  has everything you need to succeed in the world of finance.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://i.pinimg.com/736x/eb/72/e1/eb72e101812e82968ef17b62b4079d2e.jpg"
                alt="Image1"
                className="w-full h-[550px]"
              />
            </div>
          </div>
          <Separator />
          <div className="flex flex-col justify-around mt-10">
            <h1 className="text-4xl font-bold">Features</h1>
            <div className="text-2xl my-5">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-gray-600 text-2xl">
                    Smart Portfolio Insights
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Track your stocks, mutual funds, and crypto in one dashboard
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-gray-600 text-2xl">
                    Learn & Invest
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Access bite-sized lessons, market news, and curated
                    investment tips designed for beginners and pros alike — all
                    without leaving the app.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-gray-600 text-2xl">
                    Financial News
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Get the latest market updates and analysis
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-gray-600 text-2xl">
                    24/7 Customer Support
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    Our team is here to help you with any questions or concerns
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold text-gray-600 text-2xl">
                    SEBI Registered
                  </AccordionTrigger>
                  <AccordionContent className="text-xl">
                    We are SEBI registered (a basic finance project)
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <Separator />
          <div className="w-full flex justify-center py-8">
      <Carousel
        plugins={[Autoplay({ delay: 10000 })]}
        className="max-h-[550px] p-5 w-full md:w-3/4 rounded-lg shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-950"
      >
        <CarouselContent>
          {features.map((feature, index) => (
            <CarouselItem key={index} className="flex justify-center items-center h-[500px] p-4">
              <div className="w-full max-w-4xl">
                <div className="rounded-lg shadow-xl p-6 flex flex-col h-full">
                  <h2 className="text-4xl font-bold mb-4 text-left">{feature.title}</h2>
                  <div className="flex-grow flex items-center justify-center mb-4 relative aspect-square max-h-[400px]">
                    <Image
                      src={feature.image}
                      alt={feature.title || "Feature Image"}
                      layout="fill" // cover the container
                      objectFit="contain" // ensure aspect ratio is kept without cropping
                      className="rounded-md"
                      priority
                    />
                  </div>
                  <p className="text-left text-xl font-semibold text-gray-500">{feature.content}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer" />
        <CarouselNext className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 cursor-pointer" />
      </Carousel>
    </div>
          <Separator />
          <div className="h-[350px] flex flex-col justify-center items-center text-gray-500 m-10">
            <h1 className="text-2xl">Start Your Investment Journey Now!</h1>
            <Link href="/signup">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-5 text-2xl cursor-pointer">
                Get Started for Free
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
