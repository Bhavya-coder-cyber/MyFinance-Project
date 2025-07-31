import React from 'react';

export interface NewsItem {
  source: { id: string; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsCardProps {
  newsData: NewsItem[] | null;
}

const NewsCard: React.FC<NewsCardProps> = ({ newsData }) => {
  if (!newsData || newsData.length === 0) {
    return <div className="text-gray-500">No news found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {newsData.map((item) => (
        <div
          key={item.url}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden"
        >
          {item.urlToImage && (
            <img
              src={item.urlToImage}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            {item.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Read More
            </a>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(item.publishedAt).toLocaleString()} | {item.source.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsCard;
