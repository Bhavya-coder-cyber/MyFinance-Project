"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "@/components/darkmode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface NewsItem {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

function NewsPage() {
  const [search, setSearch] = useState("India finance");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  const getNews = async () => {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${search}&apiKey=a377424e9fd446de8a1c46f4f7cc24ea`
    );
    const data = await res.json();
    setNewsData(data.articles);
  };

  const handleInput = (searchName: string) => {
    setSearch(searchName);
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <div>
      <nav className="sticky top-0 z-50 shadow-md py-3 px-10 flex items-center justify-between text-xl transition-all duration-500 bg-gray-950 rounded-2xl">
        {/* MyFinance Logo Title */}
        <div className="text-2xl font-bold italic font-serif text-white dark:text-white">
          <Link href="/">MyFinance</Link>
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
      <div className="flex justify-between items-center p-10 gap-5">
        <Input
          type="text"
          placeholder="Search News"
          onChange={(e) => handleInput(e.target.value)}
        ></Input>
        <Button variant="default" onClick={getNews}>
          Search
        </Button>
      </div>
      <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
        {newsData.map((news, index) => (
          <Card key={news.url || index}>
            <CardHeader>
              <CardTitle>{news.title}</CardTitle>
              <CardDescription>
                {news.description}
              </CardDescription>
            </CardHeader>
            {news.urlToImage && (
              <img
                src={news.urlToImage}
                alt={news.title}
                className="h-48 object-cover mx-5 mb-3"
              />
            )}
            <CardContent>
              <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                By {news.author ?? "Unknown"} • {news.source.name}
                <br />
                {new Date(news.publishedAt).toLocaleString()}
              </div>
              <a
                href={news.url}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Read Full Article
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}

export default NewsPage;
