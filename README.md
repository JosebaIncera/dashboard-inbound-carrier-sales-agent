# Inbound Carrier Sales Agent Dashboard

A comprehensive analytics dashboard for tracking and visualizing inbound carrier sales agent performance metrics. Built with Next.js, and Supabase for real-time data visualization and analysis.

## Overview

This dashboard provides real-time insights into carrier sales agent performance through interactive charts, KPI tracking, and comprehensive analytics. It tracks call outcomes, negotiation performance, carrier sentiment, and financial metrics to enable data-driven decision making.

## Features

### Key Performance Indicators (KPIs)
- **Total Calls**: Complete count of all calls within selected timeframe
- **Success Rate**: Percentage of completed calls vs total calls
- **Completed Calls**: Absolute number of successfully completed calls
- **Average Call Duration**: Mean call length in minutes and seconds
- **Total Savings**: Cumulative negotiation savings across all calls
- **Average Savings Per Call**: Mean negotiation performance per call
- **Average Negotiation Attempts**: Mean number of negotiation rounds per call

### Data Visualizations
- **Call Outcome Chart**: Pie chart showing distribution of call outcomes
- **Carrier Sentiment Chart**: Bar chart tracking carrier sentiment analysis
- **Savings by Negotiation Attempts**: Bar chart correlating negotiation performance with attempt count
- **Rate Comparison Chart**: Multi-bar chart comparing load board rates, carrier offers, and agreed rates
- **Time Series Chart**: Dual-axis line chart showing daily savings vs call duration trends

### Interactive Features
- **Date Range Filtering**: Filter data by All Time, 7 days, 30 days, 90 days, or custom date ranges
- **Real-time Updates**: Automatic data refresh with timestamp display
- **Responsive Design**: Adapts to different screen sizes
- **Dark Theme**: Professional dark color scheme with high contrast

## Technology Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts library
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Deployment**: Docker containerization

## Data Structure

Each metric record contains:
- Call information (duration, status, outcome, timestamp)
- Negotiation data (attempts, performance, rate differences)
- Rate information (load board rate, carrier offer, agreed rate)
- Sentiment analysis (carrier sentiment classification)
- Organizational data (run ID, organization ID)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dashboard-inbound-carrier-sales-agent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t dashboard-inbound-carrier-sales-agent .
```

2. Run with docker-compose:
```bash
docker-compose up
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── CallDurationChart.tsx
│   ├── CallOutcomeChart.tsx
│   ├── KPICard.tsx
│   ├── NegotiationChart.tsx
│   ├── RateComparisonChart.tsx
│   ├── SavingsByAttemptsChart.tsx
│   ├── SentimentChart.tsx
│   └── TimeSeriesChart.tsx
├── lib/                   # Utility libraries
│   └── supabase.ts        # Supabase client and data types
├── supabase/              # Supabase functions
│   └── functions/
│       └── update-metrics/
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── package.json           # Dependencies and scripts
```

## API Integration

The dashboard integrates with Supabase Edge Functions for data processing:
- `update-metrics`: Processes and updates metrics data
- Real-time data fetching from PostgreSQL database
- Automatic data refresh on page load

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


