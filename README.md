# MyFinance

**MyFinance** is a full-stack stock market portfolio management application built with Next.js, MongoDB, and NextAuth authentication. It allows user to:


- Search and view live stock data from Yahoo Finance.
- Buy and sell stock units with real-time price updates and currency conversion.
- Manage and visualize their stock portfolios.
- Securely register, log in, and verify accounts.
- Receive verification email notifications via the Resend API.

The app features a clean React UI with components like stock charts, dynamic portfolios, and responsive design.

---

## 🚀 Features

- User authentication with NextAuth and Zod validation.
- Real-time stock data fetching and currency conversion.
- Fully functional buy units, sell units, and sell all units APIs.
- Portfolio aggregation and visualization with pie charts.
- Email notifications for user actions (registration, verification).
- Robust backend with Mongoose and MongoDB.
- Responsive, accessible, and user-friendly interface.

---

## 🛠️ Tech Stack

| Layer              | Technologies                   |
|--------------------|--------------------------------|
| Frontend           | Next.js, React, TypeScript     |
| Backend            | Next.js API routes, Node.js    |
| Database           | MongoDB, Mongoose              |
| UI Components      | shadcn/ui, RadixUI             |
| Schema Validation  | Zod                            | 
| Authentication     | NextAuth                       |
| Email Service      | Resend API                     |
| Stock Data         | Yahoo Finance API, TradingView |
| Currency Conversion| Open Exchange Rates API        |

---
## 🤔 How It Works

- **Create Account**: Users can sign up for an account using their fullname, username, email and password.
- **Search for stocks**: Users can search for stocks and view live data from Yahoo Finance and charts from TradingView whuch can be customised with different timeframes and indicators.
- **Buy and Sell Units**: Users can buy and sell stock units with real-time price updates and currency conversion.
- **Portfolio Management**: Users can view their portfolio and manage their stock holdings in a visually appealing way.
- **Top Up Balance or Withdraw Funds**: Users can top up their balance and withdraw funds from their wallet.

---

## 🔒 Security

- Passwords are hashed with bcrypt.
- JWT and NextAuth is used for authentication.
- All sensitive credentials are stored in environment variables.

---

## 🧩 Future Integrations & Roadmap

- **Add Crypto Transactions**: Currently, only stocks can be tracked. Although we search in the stock section also, but crypto transactions should be needed a seperate section and a seperate dashboard.
- **Learn Section**: A learning section for users to learn about finance and stock market. An agent will be trained to answer questions related to stock market and finance.
- **Mobile App**: Native iOS/Android app for warranty management on the go.
- **News Section**: Show news related to stock market is in progress.
- **Download Portfolio**: Allow users to download their portfolio as a PDF or Excel file.

---

## 🤝 Contributing

Pull requests and feature suggestions are welcome! Please open an issue to discuss your idea.

---

## 📧 License & Contact

MIT License.  
For support or business inquiries, contact [jainbhavya154@gmail.com].

---

## 🌟 Star the project on GitHub!
