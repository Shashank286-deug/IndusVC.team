# IndusVC: Financial Intelligence Platform (Prototype) 🚀

![Status](https://img.shields.io/badge/Status-Prototype-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Built%20With-React%20%7C%20Python%20%7C%20Gemini%20AI-green)

**IndusVC** is an open-source financial analysis workstation designed to bridge the gap between simple portfolio trackers and institutional-grade analysis tools. 

> **⚠️ Note:** This project is currently in the **Prototype/MVP** phase. Features are active but may contain bugs. Contributions and feedback are welcome!

---

## 📸 Screenshots

| **Dashboard** | **Portfolio Risk** |
|:---:|:---:|
| <img src="docs/dashboard.png" width="400" alt="Dashboard View"> | <img src="docs/risk-analysis.png" width="400" alt="Risk Analysis"> |
| **Real-time market tracking & Performance** | **Sector concentration & Volatility alerts** |

| **AI Interrogator** | **Interactive DCF** |
|:---:|:---:|
| <img src="docs/ai-interrogator.png" width="400" alt="AI Chat"> | <img src="docs/dcf-model.png" width="400" alt="DCF Model"> |
| **Chat with PDFs (Annual Reports) using Gemini** | **Dynamic Valuation Modeling** |

---

## 🌟 Key Features

### 1. 🤖 AI Interrogator (Powered by Gemini 1.5 Flash)
Stop reading 100-page Annual Reports manually.
* **RAG (Retrieval-Augmented Generation):** Upload financial PDFs (10-K, Annual Reports).
* **Chat Interface:** Ask questions like *"What are the key risks this year?"* or *"Summarize the revenue growth."*

### 2. 📊 Interactive DCF Model (The "Crystal Ball")
A valuation tool that doesn't require a spreadsheet.
* **Real-Time Calculation:** Adjust sliders for Revenue Growth, EBIT Margin, WACC, and Terminal Rate.
* **Visual Output:** Instantly see how assumptions impact the **Intrinsic Value** vs. **Current Market Price**.

### 3. 🛡️ Portfolio Risk Engine
Visualize the hidden risks in your holdings.
* **Sector Allocation:** Interactive pie charts showing exposure (e.g., "42% Technology").
* **Risk Alerts:** Automatic warnings for high concentration or elevated volatility.
* **Metrics:** Tracks Portfolio Beta, Sharpe Ratio, and Max Drawdown.

### 4. 📈 Market Dashboard
* Live tracking of Indian Indices (**NIFTY 50**, **SENSEX**, **Bank NIFTY**).
* Portfolio performance benchmarking against the S&P 500.
* AI-curated market news updates.

---

## 🛠️ Tech Stack

* **Frontend:** React.js / Next.js
* **Styling:** Tailwind CSS
* **AI/LLM:** Google Gemini API (Gemini 1.5 Flash)
* **Visualization:** Recharts (for data visualization)
* **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v18+)
* npm or yarn
* A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/indus-vc.git](https://github.com/yourusername/indus-vc.git)
    cd indus-vc
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your API keys:
    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your_google_api_key_here
    NEXT_PUBLIC_FINANCE_API_KEY=your_market_data_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛣️ Roadmap

- [x] Basic Dashboard & Market Data
- [x] DCF Valuation Model (MVP)
- [x] AI Document Analysis (PDF Support)
- [ ] **User Auth:** Save portfolios across sessions (Supabase/Firebase).
- [ ] **Advanced Risk:** Monte Carlo simulations.
- [ ] **Mobile Support:** Fully responsive layout for mobile devices.

---

## 🤝 Contributing

Contributions make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with 💻 and ☕ by [Your Name]**
